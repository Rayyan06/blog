# -*- coding: utf-8 -*-
from setuptools import setup

packages = \
['blog']

package_data = \
{'': ['*']}

install_requires = \
['django>=3.1.5,<4.0.0', 'markdown2>=2.3.10,<3.0.0']

setup_kwargs = {
    'name': 'blog',
    'version': '0.1.0',
    'description': 'My Personal Blog',
    'long_description': None,
    'author': 'Your Name',
    'author_email': 'you@example.com',
    'maintainer': None,
    'maintainer_email': None,
    'url': None,
    'packages': packages,
    'package_data': package_data,
    'install_requires': install_requires,
    'python_requires': '>=3.8,<4.0',
}


setup(**setup_kwargs)
