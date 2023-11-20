---
title: "Script for installing specific version of Python in CentOS"
date: "2017-10-24"
canonical: "https://balakumar.net.in/script-for-installing-specific-version-of-python-in-centos/"
categories: 
  - "Installation"
tags: 
  - "Python"
  - "CentOS"
---

Please use the following script for installing a specific version of Python without affecting the global python installation. Then you can use Python **virtualenv** to have specific python version based on your project needs.

Below script is for installing python version 2.7.10

```shell
TMP_PATH=~/tmp_install_python

# Versions section
PYTHON_MAJOR=2.7
PYTHON_VERSION=$PYTHON_MAJOR.10

mkdir $TMP_PATH && cd $TMP_PATH

# Update yum and libraries
#yum -y update
yum groupinstall -y development
yum install -y zlib-devel openssl-devel sqlite-devel bzip2-devel

# Download and extract Python and Setuptools
wget --no-check-certificate https://www.python.org/ftp/python/$PYTHON_VERSION/Python-$PYTHON_VERSION.tgz
wget --no-check-certificate https://bootstrap.pypa.io/ez_setup.py
wget --no-check-certificate https://bootstrap.pypa.io/get-pip.py
tar -zxvf Python-$PYTHON_VERSION.tgz

# Compile Python
cd $TMP_PATH/Python-$PYTHON_VERSION
./configure --prefix=/usr/local
make && make altinstall
export PATH="/usr/local/bin:$PATH"

# Install Setuptools and PIP
cd $TMP_PATH
wget --no-check-certificate https://bootstrap.pypa.io/ez_setup.py
wget --no-check-certificate https://bootstrap.pypa.io/get-pip.py
/usr/local/bin/python$PYTHON_MAJOR ez_setup.py
/usr/local/bin/python$PYTHON_MAJOR get-pip.py

# Finish installation
rm /usr/local/bin/python
ln -s /usr/local/bin/python2.7 /usr/local/bin/python
rm /usr/bin/pip
ln -s /usr/local/bin/pip /usr/bin/pip

pip install virtualenv
cd
rm -rf $TMP_PATH
```