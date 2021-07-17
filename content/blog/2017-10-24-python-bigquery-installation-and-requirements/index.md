---
title: "Python - BigQuery installation and requirements"
date: "2017-10-24"
canonical: "https://balakumar.net.in/python-bigquery-installation-and-requirements/"
categories: 
  - "bigquery-2"
  - "python"
tags: 
  - "bigquery"
  - "python"
---

## Installing pip

If you don't have the **pip** installed in your system, then follow the below steps to install pip.

Download **get-pip.py** via [https://bootstrap.pypa.io/get-pip.py](https://bootstrap.pypa.io/get-pip.py) to a directory on your computer.

Run the following command.

```shell
python get-pip.py
```

Ensure pip is installed or not by running **pip --version**

On Windows, make sure you have added the Python Scripts folder in to path environment variables.

Example: C:\Python27\Scripts to **Path** env

 

## Installing BigQuery and dependencies

Always do a **pip upgrade**, before you installing any package through pip.

Run the following commands to upgrade pip.

```shell
pip install --upgrade pip
OR 
python -m pip install -U pip
```

Run the following commands to install all the required packages for BigQuery Python.

```shell
pip install configparser
pip install --upgrade google-cloud-bigquery
pip install --upgrade google-api-python-client
pip install google-auth-httplib2
```

**Note:** If the command pip install google-auth-httplib2 fails, then again run pip install --upgrade google-api-python-client

#### configparser

For reading and parsing any form config files (like ini, cfg..)

#### google-cloud-bigquery

Cloud Client Libraries for the Google BigQuery API. [https://googlecloudplatform.github.io/google-cloud-python/latest/bigquery/usage.html](https://googlecloudplatform.github.io/google-cloud-python/latest/bigquery/usage.html)

#### google-api-python-client

Python client library for Google's discovery based APIs (connecting based on the scope.. spreadsheets, drive.. etc) [https://github.com/google/google-api-python-client](https://github.com/google/google-api-python-client)

#### google-auth-httplib2

This library provides an httplib2 transport for google-auth. [https://github.com/GoogleCloudPlatform/google-auth-library-python-httplib2](https://github.com/GoogleCloudPlatform/google-auth-library-python-httplib2)
