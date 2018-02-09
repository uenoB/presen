# presen.js
A minimal HTML-based presentation tool, written in vanilla JavaScript,
less than 200 lines of code.

Check out [the manual slides], which also serves as a live demo.

## Getting started

1. Use the lastest (or recent) version of a modern web browser.
2. Write an HTML file like this:
   ````
   <!DOCTYPE html>
   <html>
     <head>
       <meta charset="UTF-8">
       <title>My Awesome Slides</title>
       <script src="presen.js"></script>
       <link rel="stylesheet" href="presen.css">
     </head>
     <body>
       <header>
         <h1>My Awesome Presentation</h1>
         <p>My Awesome Name</p>
       </header>
       <section>
         <h2>My Awesome First Slide</h2>
         <p>Put something awesome here.</p>
       </section>
     </body>
   </html>
   ````
3. Put the HTML file, [presen.js], and [presen.css] in the same
   directory.
4. Open the HTML file in the web browser.

## Contributing

We kindly ask all the contributors to agree with the following policy:
*keep everything minimal and minimum*.
We believe that this is the best way to continue the
project without loosing its clarity.

To enforce this policy, we force ourselves to keep each program file
in the project less than 200 lines of code in a standard style.
We do not accept any changes exceeding this limit unless we are
finally persuaded that the changes are exceptionally important.

We do not maintain anything less important than the mimimality, such
as version numbers, release packages, coding conventions, and
backward compatibility.
We do not consider old browsers that do not support ES6 and CSS3
since they enforce old-fashioned lengthy keywords and rules.
Any requests on them would be simply rejected.

## Versioning

Use the commit hashes as version numbers.
Each commit belonging to the master branch with the log message "Release"
constitutes a release.

## License

This software is licensed under the MIT License.
See the [LICENSE] for details.

[LICENSE]: LICENSE
[presen.js]: presen.js
[presen.css]: presen.css
[the manual slides]: https://uenob.github.io/presen/presen.html
