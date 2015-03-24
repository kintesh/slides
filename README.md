# slides [![Build Status](https://magnum.travis-ci.com/kintesh/slides.svg?token=DVy8k5QfBqWJZbznAXvF&branch=master)](https://magnum.travis-ci.com/kintesh/slides)
A tool to make and present HTML5 slides. Supports mathematical equations using MathJax.

This module provides CLI for making slides. A GUI app can be found here
[https://github.com/kintesh/slides-app] (https://github.com/kintesh/slides-app)



# Usage

Default output for offline presentation:

    $ slides /path/to/source

Single file output for online presentation (requires internet connection when presenting):

    $ slides -o /path/to/source



# Writing slides

Slides uses markdown at its core to render HTML with few additional formatting.

Additional formatting:

    -> TEXT <-       to align text center of the slide.

### Escape tags
When writing slides, use `\` to escape special tags such as `$`, `[[`, `]]`, `-`, `>`, `*` and `#`. i.e. `\$` becomes $, `\[[`
becomes `[[` and so on...


### Comments
Comments can be written between `/*` and `*/` tags. The comments will not be included in the produced slides.


### Properties
Properties are very important and are used for setting presentation properties, title slide and meta information.
The following properties are available:

    title:      sets slides title
    sub_title:  sets slides subtitle/topic
    author:     author
    date:       date


### Title slide

The title slides is automatically generated when properties are set.


### Slide
Each slide must begin with `====` and also end with `====`. Any content between these tags will be put under one slide.
Multiple slides can be defined in one document.

The default css of any slide can be overridden. To do this, place any css between `[[` and `]]` tags. The properties
tag must go immediately after begin slide tag `====`. For example:

    ====
    [[background-color:aquamarine; color:black]]
    # ->Slide<-

    slide contents.....

    ====

### Content properties
Similar to slides, properties of its content can also be set and/or overridden. Again the properties must go between
`[[` and `]]` tags. However unlike the slides, the content property must go before before the content.

Besides standard css styles, slides provides following custom properties:

    property : value
    ---------------------------------------
    reveal   : true | false
    anim     : dropDown | slideInLeft


### Writing maths
Slides supports rendering math equations both inline and block. Inline maths should be written between `$` and `$` tags.
Block maths should be written between `$$` and `$$` tags.

    ====
    [[background-color:aquamarine; color:black]]
    # ->Mass–energy equivalence<-

    The equivalence of energy $E$ and mass $m$ is reliant on the speed of light $c$ and is described by the famous equation:

    $$ E = mc^2 $$

    ====



# Presenting slides

When presenting use following keyboard shortcuts to interact with slides:

    key                                         | result
    ------------------------------------------------------------------------
    Arrow Left, Arrow Down, Left Angle Bracket  | Next slide
    Arrow Right, Arrow UP, Right Angle Bracket  | Previous slide
    F, f, Return/Enter                          | Toggle full screen
    C, c                                        | Open presentation console
    H, h                                        | Show help menu



# Example

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


# Licence
---------
