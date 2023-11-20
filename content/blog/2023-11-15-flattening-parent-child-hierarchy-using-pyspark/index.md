---
title: "Flattening Parent Child Hierarchy using PySpark"
date: "2023-11-15"
lastModDate: "2023-11-15"
canonical: "https://balakumar.net.in/flattening-parent-child-hierarchy-using-pyspark/"
categories: 
  - "data-engineering"
  - "bigdata"
tags: 
  - "pyspark"
  - "python"
---

Solution to produce flattened hierachy columns for a parent-child relation data.

Lets assume, we have the following dataframe

```
+---+---------+
|id |parent_id|
+---+---------+
|A  |null     |
|B  |A        |
|C  |A        |
|D  |B        |
|E  |D        |
+---+---------+
```

And, we need to produce a flattened hierarchy as like below

```
+---------+---------+---------+
|level1_id|level2_id|level3_id|
+---------+---------+---------+
|A        |null     |null     |
|B        |A        |null     |
|C        |A        |null     |
|D        |B        |A        |
|E        |D        |B        |
+---------+---------+---------+
```

## PySpark script to flatten hierarchy

```python
from pyspark.sql.session import SparkSession
import pyspark.sql.functions as F
from pyspark.sql.types import *
from pyspark.sql import DataFrame

spark = (
    SparkSession.builder.master('local[*]')
    .appName('test_app')
    .getOrCreate()
)

def flatten_hierarchy(
        df: DataFrame, node_id: str, node_parent_id: str,
        max_hier_level: int, hierarchy_label: str=None, other_fields: list=None
    ) -> DataFrame:
    
    hierarchy_label = f'_{hierarchy_label}' if hierarchy_label else ''

    other_fields = other_fields if isinstance(other_fields, list) else []

    df_hierarchy = (
        df.withColumnRenamed(node_id, f'level1{hierarchy_label}_id')
        .withColumnRenamed(node_parent_id, f'level2{hierarchy_label}_id')
    )
    for fld in other_fields:
        df_hierarchy = df_hierarchy.withColumnRenamed(fld, f'level1{hierarchy_label}_{fld}')

    i = 2

    while i <= max_hier_level:
        cur_level = f'level{i}{hierarchy_label}_id'
        next_level = f'level{(i+1)}{hierarchy_label}_id'
        next_level_tmp = f'level_{(i+1)}_tmp'

        df_hlevel = (
            df.withColumnRenamed(node_id, cur_level)
            .withColumnRenamed(node_parent_id, next_level)
        )
        for fld in other_fields:
            df_hlevel = df_hlevel.withColumnRenamed(fld, f'level{i}{hierarchy_label}_{fld}')

        df_hierarchy = df_hierarchy.join(df_hlevel, cur_level, 'left')
        df_hierarchy = df_hierarchy.select('*', df_hierarchy[next_level].alias(next_level_tmp))
        df_hierarchy = df_hierarchy.drop(next_level)
        df_hierarchy = df_hierarchy.withColumnRenamed(next_level_tmp, next_level)

        i += 1

        if i == max_hier_level+1:
            df_hierarchy = df_hierarchy.drop(next_level)

    return df_hierarchy.select(sorted(df_hierarchy.columns))
```

## Usage options


#### Default options

Flattened level columns without label and additional columns

```python
df = spark.createDataFrame(
    [
        ('A', None),
        ('B', 'A'),
        ('C', 'A'),
        ('D', 'B'),
        ('E', 'D')
    ],
    ['id', 'parent_id'],
)

df.show(truncate=False)

df_test = flatten_hierarchy(
    df=df,
    node_id='id',
    node_parent_id='parent_id',
    max_hier_level=3,
)

df_test.show(truncate=False)
```

```
+---------+---------+---------+
|level1_id|level2_id|level3_id|
+---------+---------+---------+
|A        |null     |null     |
|B        |A        |null     |
|C        |A        |null     |
|E        |D        |B        |
|D        |B        |A        |
+---------+---------+---------+
```

#### With additional options

With label for all flattened level columns, along with additional columns from the source data.

```python
df = spark.createDataFrame(
    [
        ('A', None, 'Node-A'),
        ('B', 'A', 'Node-B'),
        ('C', 'A', 'Node-C'),
        ('D', 'B', 'Node-D'),
        ('E', 'D', 'Node-E')
    ],
    ['id', 'parent_id', 'name'],
)

df.show(truncate=False)
```

```
+---+---------+------+
|id |parent_id|name  |
+---+---------+------+
|A  |null     |Node-A|
|B  |A        |Node-B|
|C  |A        |Node-C|
|D  |B        |Node-D|
|E  |D        |Node-E|
+---+---------+------+
```

```python
df_test = flatten_hierarchy(
    df=df,
    node_id='id',
    node_parent_id='parent_id',
    max_hier_level=3,
    hierarchy_label='test',
    other_fields=['name']
)

df_test.show(truncate=False)
```

```
+--------------+----------------+--------------+----------------+--------------+----------------+
|level1_test_id|level1_test_name|level2_test_id|level2_test_name|level3_test_id|level3_test_name|
+--------------+----------------+--------------+----------------+--------------+----------------+
|A             |Node-A          |null          |null            |null          |null            |
|B             |Node-B          |A             |Node-A          |null          |null            |
|D             |Node-D          |B             |Node-B          |A             |Node-A          |
|E             |Node-E          |D             |Node-D          |B             |Node-B          |
|C             |Node-C          |A             |Node-A          |null          |null            |
+--------------+----------------+--------------+----------------+--------------+----------------+
```
