const fs = require('fs');
const MarkdownParser = require('./parser');

// Read MathJax script from file
const mathjaxScript = fs.readFileSync('mathjax_script.html', 'utf8');

// Example usage
const parser = new MarkdownParser('rules.yaml');
const markdownText = `
# Heading level 1
## Heading level 2
### Heading level 3
#### Heading level 4
##### Heading level 5
###### Heading level 6

.Feeding the Werewolves
[NOTE]
====
While werewolves are hardy community members, keep in mind the following dietary concerns:

. They are allergic to cinnamon.
. More than two glasses of orange juice in 24 hours makes them howl in harmony with alarms and sirens.
. Celery makes them sad.
====

__bold text__
**bold text**
_italic text_
*italic text*
\`word\`
+ First item
+ Second item
[Guide](https://www.google.com)
$\\sqrt{x^2 + y^2}$
`;

const htmlText = parser.parse(markdownText);

// Combine HTML output with MathJax script
const finalHtml = `
<html>
<head>
    <title>Markdown to HTML</title>
    ${mathjaxScript}
</head>
<body>
    ${htmlText}
</body>
</html>
`;

console.log(finalHtml);