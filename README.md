# slides [![Build Status](https://travis-ci.org/kintesh/slides.svg?branch=master)](https://travis-ci.org/kintesh/slides)
A tool to make and present HTML5 slides. Supports mathematical equations using MathJax.

This module provides CLI for making slides. A GUI app can be found here
[https://github.com/kintesh/slides-app] (https://github.com/kintesh/slides-app)



#Installation

This tool requires Node.js. Download and install latest version of Node.js for your platform from
[nodejs.org] (https://nodejs.org/download/)

Run the following command to install latest version of slides.

    $ npm install -g https://github.com/kintesh/slides/tarball/master

Note: You may need to run this command with sudo (i.e. `$ sudo npm install -g https://github.com/kintesh/slides/tarball/master`).



#Usage

Default output for offline presentation:

    $ slides /path/to/source

Single file output for online presentation (requires internet connection when presenting):

    $ slides -o /path/to/source



#Writing slides

Slides uses markdown at its core to render HTML with few additional formatting.


##Comments

Comments are written between `/*` and `*/` tags. The comments will be removed when translating the slides and will not be included in the produced slides.


##Properties

The properties are used for generating title slide and setting up meta tags of the output HTML file. Therefore it is recommended to specify all properties when writing slides. The properties must be defined at top of a document and fore the first slide.
The following properties are available:

    title:      sets slides title
    sub_title:  sets slides subtitle/topic
    author:     author
    date:       date


##Title slide

The title slides is automatically generated based on the specified properties.


##Slide
Each slide must begin with `====` (four equals symbols) and also end with `====` (four equals symbols). Any content between these tags will be put under one slide.

    ====
    
    slide contents goes here...
    
    ====


##Styling slides
The default css style of any slide can be overridden. To do this, place any css styles between `[[` and `]]` tags. The properties tag must go immediately after the begin slide tag `====`. For example:

    ====
    [[background-color:aquamarine; color:black]]

    slide contents.....

    ====


##Paragraphs

Writing paragraphs does not require any syntax. Paragraphs are written simply writing one or more consecutive lines of text.

    ====
        
    Writing paragraphs does not require any syntax. Paragraphs are 
    written simply writing one or more consecutive lines of text.

    This is a 2nd paragraph.
    ====


##Headers
HTML headers 1 to 6 are written using hash characters at the start of the line. The number of hash characters represents the header level.

    ====
    
    # H1 header
    ## H2 header
    ### H3 header
    #### H4 header
    ##### H5 header
    ###### H6 header

    ====


##Text formatting and alignment

The following text formatting are provided using various tags.

  * \*Italic text\* results in *Italic text*
  * \*\*bold text\*\* results in **bold text**
  * \`monospace text\` results in `monospace text`
  * -> align center  <- results the text being aligned to the center of a slide


##Escape tags

When writing slides, use `\\` followed a tag to escape it. For example \\\`foo\\\`, \\\*bar\\\* results in \`foo\`, \*bar\*


##Blockquotes

Blockquotes are written using right angle character `>`.

    ====
    > Block quotes are
    > written like so.
    >
    > They can span multiple paragraphs,
    > if you like.
    ====


##Lists

Lists are written using asterisks or numbers. Note that (not considering the asterisk) the actual text content starts at 4-columns in.

    ====
    Itemized lists look like:
    [[reveal:true]]
      * this one
      * that one
      * the other one

    Here's a numbered list:
    [[reveal:true]]
     1. first item
     2. second item
     3. third item
    ====


##Writing maths

Slides supports rendering math equations both inline and block. Inline maths should be written between `\$` and `\$` tags. Block maths should be written between  `\$\$` and `\$\$` tags.

    ====
    [[background-color:cadetblue; color:black]]
    # ->Mass–energy equivalence<-

    The equivalence of energy $E$ and mass $m$ is reliant on the speed 
    of light $c$ and is described by the famous equation:

    $$ E = mc^2 $$

    ====


##Content properties

Similar to styling slides, properties of its content can also be set and/or overridden. Again the properties must go between `[[` and `]]` tags. Unlike styling slides, the content property must go before the content.


Besides standard css styles, slides provides following custom properties:

    property : value
    ---------------------------------------
    reveal   : true | false
    anim     : dropDown | slideInLeft


##Code Blocks

Pre-formatted code blocks are written by indenting every line of the block by at least 4 spaces or 1 tab.

     ====
     Soup algorithm:
         find wooden spoon
         uncover pot
         stir
         cover pot
         balance wooden spoon precariously on pot handle
         wait 10 minutes
         goto first step (or shut off burner when done)
    Do not bump wooden spoon or it will fall.
    ====


##Links

Links are written like so:

    ====
    This project can be found on [Github](https://github.com/kintesh/slides).
    
    [Kintesh Patel](https://kinte.sh).
    ====


##Images

Images are inserted like so:

    ====
    ![Alt text](/path/to/img.jpg)
    ![Alt text](/path/to/img.jpg "Optional title")
    ====


##Tables

Tables are written by formatting it as shown below.

    ====
    # Table

    |size | material   |  color
    |---- | ---------- | -----------
    |9    |leather     |  brown
    |10   |hemp canvas |  natural
    |11   |glass       |  transparent
    
    # Advanced table
    |keyword  | text
    |-------- | -----------------------
    |red      | Sunsets, apples, and
    |         | other red or reddish
    |         | things.
    |green    | Leaves, grass, frogs
    |         | and other things it's
    |         | not easy being.
    
    ====



#Presenting slides

When presenting use following keyboard shortcuts to interact with slides:

    key                     | result
    ------------------------------------------------------
    Arrow Left, Arrow Down  | Next slide
    Arrow Right, Arrow UP   | Previous slide
    F, f, Return/Enter      | Toggle full screen
    C, c                    | Open presentation console
    H, h                    | Show help menu



#Example

    /**
     * Created by kintesh on 28/01/15.
     */


    title: Sample Slides
    sub_title: Sample slides showing various features.
    author: Kintesh Patel
    date: 28/01/2015


    /* slide 1 */
    ====
    [[background-color:aquamarine; color:black]]
    # ->Headers<-

    # H1 header
    [[color:red]]
    ## H2 header
    [[reveal:true; color:red]]
    ### H3 header
    [[reveal:true; color:coral]]
    #### H4 header
    [[reveal:true]]
    ##### H5 header
    [[reveal:true]]
    ###### H6 header

    ====

    /* slide 2 */
    ====
    [[background-color:cadetblue; color:black]]
    # ->Text<-


    Paragraphs are separated by a blank line.

    This is the 2nd paragraph. Text styles *Italic*, **bold**, `monospace` and ~~Strikethrough~~.

    And note that you can backslash-escape any punctuation characters
    which you wish to be displayed literally, ex.: \`foo\`, \*bar\*, etc.


    > Block quotes are
    > written like so.
    >
    > They can span multiple paragraphs,
    > if you like.


    ====

    /* slide 3 */
    ====
    [[background-color:indianred; color:black]]
    # ->Lists<-


    Itemized lists look like:
    [[reveal:true]]
      * this one
      * that one
      * the other one

    Here's a numbered list:
    [[reveal:true]]
     1. first item
     2. second item
     3. third item

    Note: that --- not considering the asterisk --- the actual text content starts at 4-columns in.

    ====

    /* slide 4 */
    ====
    [[background-color:indianred; color:black]]
    # ->Lists (2)<-


    Now a nested list:
    [[reveal:true]]
     1. First, get these ingredients:

          * carrots
          * celery
          * lentils

     2. Boil some water.

     3. Dump everything in the pot and follow
        this algorithm:

            find wooden spoon
            uncover pot
            stir
            cover pot
            balance wooden spoon precariously on pot handle
            wait 10 minutes
            goto first step (or shut off burner when done)

        Do not bump wooden spoon or it will fall.

    Notice again how text always lines up on 4-space indents (including
    that last line which continues item 3 above).

    ====

    /* slide 5 */
    ====
    # ->Tables<-


    Tables can look like this:

    |size | material   |  color
    |---- | ---------- | -----------
    |9    |leather     |  brown
    |10   |hemp canvas |  natural
    |11   |glass       |  transparent

    Table: Shoes, their sizes, and what they're made of

    (The above is the caption for the table.) Pandoc also supports
    multi-line tables:


    |keyword  | text
    |-------- | -----------------------
    |red      | Sunsets, apples, and
    |         | other red or reddish
    |         | things.
    |green    | Leaves, grass, frogs
    |         | and other things it's
    |         | not easy being.
    ====

    /* slide 6 */
    ====
    # ->Maths<-


    Inline math equations go in like so: $ \omega = d\phi / dt $. Display
    math should get its own line and be put in in double-dollarsigns:

    Maxwell's equations:
    $$ \nabla \cdot \vec{E} = \frac{\rho}{\epsilon_0} $$
    $$ \nabla \cdot \vec{B} = 0 \nonumber $$
    $$ \nabla \times \vec{E} = - \frac{\partial B}{\partial t} \nonumber $$
    $$ \nabla \times \vec{B} = \mu_{0}\vec{J} + \mu_{0}\epsilon_{0}\frac{\partial E}{\partial t} $$

    And note that you can backslash-escape any punctuation characters
    which you wish to be displayed literally, ex.: \`foo\`, \*bar\*, etc.


    [[reveal:true]]
      * $ E = mc^2 $
      * $ \cos (2\theta) = \cos^2 \theta - \sin^2 \theta $
      * $ c = \pm\sqrt{a^2 + b^2} $
      * the other one

    ====



#Licence

Copyright 2015 Kintesh Patel

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.