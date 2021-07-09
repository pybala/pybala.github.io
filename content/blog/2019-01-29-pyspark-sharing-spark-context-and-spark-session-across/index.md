---
title: "PySpark - Sharing Spark context and Spark session across"
date: "2019-01-29"
categories: 
  - "bigdata"
  - "pyspark"
tags: 
  - "pyspark"
  - "spark"
  - "sparkcontext"
  - "sparksession"
---

Many of you have wondered about sharing the same Spark context across scripts.

My requirement is to serve data from HDFS **parquet** for any kind of requests, whether Web or Kafka or from any module.

As initial spark reading is costlier, the idea is to create **Dataframe** or **temp tables** by reading all different parquet or any other data in to spark session upfront and of course we have to deal with updating the data as well (we will talk about this later).

### **Simple example:**

I had a doubt about how setting/updating the data in the shared session reflects or not wherever its shared.

This is what I did.

Start the Spark session in the main script, pass the session to other modules (example1.py and example2.py). In example1.py, I'm reading a parquet file and putting into temp table. In example2.py, I tried to get the data by running the query on the shared session and it worked.

**Files:**

- main_script.py
- example1.py
- example2.py

**main_script.py**

```python
from pyspark import SparkContext, SparkConf
from pyspark.sql import SparkSession
from example1 import testExample1Script
from example2 import testExample2Script

def testMainScript(): 
    sc = SparkContext(conf=SparkConf())
  
    spark = SparkSession(sc).builder \
        .master("local\[\*\]") \
        .appName("test\_app") \
        .getOrCreate()

    testExample1Script(spark)

    testExample2Script(spark)

if __name__ == "__main__":
  testMainScript()
```

**example1.py**

```python
HDFS_PARQUET_TEST = "/opt/data/test/part-*"

def testExample1Script(spark):
  testDF = spark.read.parquet(HDFS_PARQUET_TEST)
  testDF.show(1)

  testDF.createGlobalTempView("test_table")
```

**example2.py**

```python
def testExample2Script(spark):
  spark.sql("SELECT * FROM global_temp.test_table").show(2)
```

So the point here is, if you add/update data anywhere on the shared spark session across application, you should be able to get the results.

## Other options for sharing the spark context:

### Apache Livy

[https://livy.incubator.apache.org/](https://livy.incubator.apache.org/)

A REST based context manager, you create session and execute any job/statement using the session. Basically you can run jobs on Spark server from anywhere (ie) remotely by using LIVY. So its very clear separation from application logic. The main advantage with Livy is you can even share the same Dataframe object across applications. So, literally you can do all kind of actions as like in interactive notebook across all the applications. All you need is clever way of managing the session id and the context for the session. 

One main issue with Livy is that you have to submit the job (complete script as job) every time.

### Spark-JobServer

[https://github.com/spark-jobserver/spark-jobserver](https://github.com/spark-jobserver/spark-jobserver)

[https://github.com/spark-jobserver/spark-jobserver/tree/master/job-server-python](https://github.com/spark-jobserver/spark-jobserver/tree/master/job-server-python)

Same like LIVY, you have to submit jobs via REST apis, but Livy is little more easy to use.

### Mist

[https://hydrosphere.io/mist/](https://hydrosphere.io/mist/)

With Mist, you have to initialize the spark context from your main script and then pass the context wherever needed. Mist has decorators for getting all the contexts [https://hydrosphere.io/mist-docs/lib\_python.html](https://hydrosphere.io/mist-docs/lib_python.html) and then the respective functions are executed as jobs by Mist.

[https://github.com/Hydrospheredata/mist/issues/535](https://github.com/Hydrospheredata/mist/issues/535) 

### Apache Ignite

Apache Ignite is nothing to do with managing Spark Context, but it complements by sharing the data efficiently.

Its a Database and distributed in-memory Caching platform, has its own file system called IGFS (Ignite file system) and dedicated sql engine. So you can use it along with Spark for storing the data or you can put the data in to ignite sql as well.

Some of the questions (my doubts) I asked in their forum.

[http://apache-ignite-users.70518.x6.nabble.com/Apache-Ignite-not-able-to-cache-Dataframe-using-Python-thin-client-td26633.html](http://apache-ignite-users.70518.x6.nabble.com/Apache-Ignite-not-able-to-cache-Dataframe-using-Python-thin-client-td26633.html)

[http://apache-ignite-users.70518.x6.nabble.com/PySpark-Failed-to-find-data-source-ignite-td26689.html](http://apache-ignite-users.70518.x6.nabble.com/PySpark-Failed-to-find-data-source-ignite-td26689.html)
