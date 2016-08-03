# slana

Slana transforms your Node module into a command-line tool.

# Installation

Add Slana to your Node module as you would any other dependency:

```javascript
npm install --save slana
```

# Quick Setup

*STEP 1.*

The first thing you need to do is to add a ```bin``` entry to your module's ```package.json``` file that points to Slana. Like so:

```javascript
"bin" : {
  "my-tool" : "./node_modules/slana/bin"
}
```

*STEP 2.*

Now simply add a ```slana.yaml``` file to your module's root directory, where you will tell Slana what your command-line tool does. Read on for the ```slana.yaml``` file format.

# The slana.yaml file format

The ```slana.yaml``` format is based on the YAML format and it has tow main sections: the ```name``` of your command-line tool and the ```commands``` your tool supports. Each of these sections are mandatory and if you forget to include either one of them, Slana will complain.

## Name

The ```name``` is a string that tells Slana what your command-line tool will be called. This will end up being the name of your binary executable. It could be the same as your module name, or it could be different. It's up to you.

*Example:*

```yaml
name: my-tool
```

## Commands

The ```commands``` section is a list of one or more commands that you want your command-line tool to support. Each command has a ```name```, a ```description```, an ```executor``` and may or may not have ```options```.

*Example:*

```yaml
commands:
- name: hello-world
  description: This greets everyone in the world
  executor: general-executor
- name: hello
  description: This commands says hello
  executor: main-executor
  options:
  - name: name
    alias: n
    description: The person we want to greet
    default: there
    type: string
- name: bye
  description: This commands says goodbye
  executor: main-executor
  options:
  - name: name
    alias: n
    description: The person we want to greet
    default: now
    type: string
  - name: shout
    alias: s
    description: Shout the goodbye
    type: boolean
```

# License

Copyright (c) 2016 I. Dan Calinescu

 Licensed under the The MIT License (MIT) (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 https://raw.githubusercontent.com/idancali/slana/master/LICENSE

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
