# Slana

<p align="center">
  <a href="https://github.com/idancali/slana">
    <img height="256" src="https://raw.githubusercontent.com/idancali/slana/master/logo.png">
  </a>
  <p align="center"> <b> Slana </b> Fattens Up Your Node Module With Delicious CLI Abilities. </p>
</p>

# Installation

Add Slana to your Node module as you would any other dependency:

```javascript
npm install --save slana
```

# Quick 2-Step Setup

**STEP 1**

The first thing you need to do is to add a ```bin``` entry to your module's ```package.json``` file that points to Slana and that defines the name of your command-line tool. Like so:

```javascript
"bin" : {
  "my-tool" : "./node_modules/slana/bin/cli.js"
}
```

**STEP 2**

Now simply add a ```slana.yaml``` file to your module's root directory, where you will tell Slana what your command-line tool does. Read on for the ```slana.yaml``` file format.

# The slana.yaml file format

The ```slana.yaml``` format is based on the YAML format and it has two main sections: the ```name``` of your command-line tool and the ```commands``` your tool supports. Each of these sections are mandatory and if you forget to include either one of them, Slana will complain.

## Name

The ```name``` is a string that tells Slana what your command-line tool will be called. This will end up being the name of your binary executable. It could be the same as your module name, or it could be different. It's up to you. You must ensure that this name is defined in your list of binaries in your manifest, as outlined above in **STEP 1**.

**Example:**

```yaml
name: my-tool
```

## Commands

The ```commands``` section is a list of one or more commands that you want your command-line tool to support. Each command has a ```name```, a ```description```, an ```executor``` and may or may not have ```options```.

**Example:**

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

# The Slana API

You can also include Slana into your tool, as a library.

```javascript
var slana = require('slana');
```

And then you can use any of the exported functions available:

```javascript
stopWithError (error)
loadInventory(dir)
initializeCLI(inventory, dir)
executeCommand(inventory, cli, dir)
sparseCommand(command, cli, dir)
extractCommand(cli, inventory, dir)
run(dir)
```

In most cases you probably just wanna do this:

```javascript
#!/usr/bin/env node

var slana = require('slana');
slana.run(process.cwd());
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
