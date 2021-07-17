---
title: "PySpark - Merging dataframes"
date: "2019-08-07"
canonical: "https://balakumar.net.in/pyspark-merging-dataframes/"
categories: 
  - "bigdata"
  - "pyspark"
  - "python"
tags: 
  - "dataframe"
  - "pyspark"
---

Example here is to talk about how to add new records to existing dataframes.

Lets say we have the following Dataframe, that is stored in HDFS in parquet format.

```python
from pyspark.sql import SparkSession

spark = SparkSession \
    .builder \
    .master('local\[\*\]') \
    .getOrCreate()

kingsHdfs = '/opt/data/hadoop/example1'

kingsDF = spark.read.parquet( kingsHdfs )
kingsDF.show(kingsDF.count(), False)
```

id | name | age
--- | --- | ---
111 | Cheran | 28
112 | Chozhan | 30


Now,

1. I'm going to add a new record to this dataframe using the record created through **createDataFrame** method.
    1. Row(id=113, name='Pandiyan', age=32)
2. Then, merge using **union** method in pyspark dataframe

```python
from pyspark.sql import SparkSession
from pyspark.sql import Row

spark = SparkSession \
    .builder \
    .master('local\[\*\]') \
    .getOrCreate()

kingsHdfs = '/opt/data/hadoop/example1'

kingsDF = spark.read.parquet( kingsHdfs )
kingsDF.show(kings_df.count(), False)

kingsRec = [
    Row(id=113, name='Pandiyan', age=32),
]
newDF = spark.createDataFrame(kingsRec)
newDF.show(1, False)

mergedDF = kingsDF.union(ne_df)
mergedDF.show(df_merged.count(), False)
```

id | name | age
--- | --- | ---
111 | Cheran | 28
112 | Chozhan | 30

age | id | name
--- | --- | ---
32 | 113 | Pandiyan

id | name | age
--- | --- | ---
111 | Cheran | 28
112 | Chozhan | 30
32 | 113 | Pandiyan

As you see in the last print, the newly inserted records is not in the right column associated with it.

Now note the second print, the columns in the new record shown in alphabetical order.

This is because we created the dataframe with **kwargs in createDataFrame, to preserve our custom order in the columns we have to use named tuples as like below.

```python
from collections import namedtuple

kingsCol = namedtuple('kingsCol', ['id', 'name', 'age'])
newDF = spark.createDataFrame([
    kingsCol(113, 'Pandiyan', 32),
])
newDF.show(1, False)
```

id | name | age
--- | --- | ---
113 | Pandiyan | 32


## Final script

```python
from pyspark.sql import SparkSession
from pyspark.sql import Row
from collections import namedtuple

spark = SparkSession \
    .builder \
    .master('local[*]') \
    .getOrCreate()

kingsHdfs = '/opt/data/hadoop/example1'
kingsDF = spark.read.parquet( kingsHdfs )

kingsCol = namedtuple('kingsCol', ['id', 'name', 'age'])
newDF = spark.createDataFrame([
    kingsCol(113, 'Pandiyan', 32),
])

mergedDF = kingsDF.union(newDF)
mergedDF.show( mergedDF.count(), False )
```

id | name | age
--- | --- | ---
111 | Cheran | 28
112 | Chozhan | 30
113 | Pandiyan | 32