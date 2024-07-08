import io
from setuptools import setup, find_packages

long_description = io.open("README.rst", encoding="utf-8").read()

setup(
    name='django-sections',
    version='0.5',
    description="Django Sectional Editor",
    long_description=long_description,
    url="http://github.com/iarp/django-sections",
    author='IARP',
    author_email='iarp.opensource@gmail.com',
    license='MIT',
    packages=find_packages(),
    install_requires=["django>=1.11", "requests"],
    extra_require={
        "ckeditor": ["django-ckeditor"],
    },
    zip_safe=False
)
