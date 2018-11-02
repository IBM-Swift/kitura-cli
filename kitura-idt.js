#!/usr/bin/env node

/*
 * Copyright IBM Corporation 2017
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const program = require('commander');
const request = require('request');
const spawn = require('child_process').spawn;

program
    .parse(process.argv);

const url = 'https://ibm.biz/kitura-idt';

// Run bash, setting stdin as a pipe
let child = spawn('bash', [], { stdio: ['pipe', 'inherit', 'inherit'] });
child.on('error', (err) => {
    console.error(err);
});
child.on('close', (code) => {
    process.exit(code);
});

// Ensure that Ctrl-C also kills the child
process.on('SIGINT', () => {
    child.kill('SIGINT');
    process.exit();
});

// Download the IDT installer and pipe it to the child
request
    .get({url, followAllRedirects: true})
    .on('error', (err) => { console.error(err); })
    .pipe(child.stdin);
