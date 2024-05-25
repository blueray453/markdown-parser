const fs = require('fs');
const yaml = require('js-yaml');

// Define the transformation functions for AST to HTML
const transformFunctions = {
    noteTransform: (content) => `<div class="note">${content}</div>`,
    blockTitleTransform: (content) => `<div class="title">${content}</div>`,
    headingTransform: (level, content) => `<h${level}>${content}</h${level}>`,
    boldTransform: (content) => `<strong>${content}</strong>`,
    italicTransform: (content) => `<em>${content}</em>`,
    codeTransform: (content) => `<code>${content}</code>`,
    listTransform: (content) => `<li>${content}</li>`,
    linkTransform: (text, url) => `<a href="${url}">${text}</a>`,
    mathTransform: (content) => `\\(${content}\\)`,
};

// Load the rules from the YAML file
const loadRules = (rulesFile) => {
    const fileContents = fs.readFileSync(rulesFile, 'utf8');
    const rules = yaml.load(fileContents);
    return rules.rules;
};

// Markdown parser class
class MarkdownParser {
    constructor(rulesFile) {
        this.rules = loadRules(rulesFile);
    }

    parseToAST(text) {
        const ast = [];
        for (const rule of this.rules) {
            const pattern = new RegExp(rule.regex, 'gm');
            let match;
            while ((match = pattern.exec(text)) !== null) {
                ast.push({ type: rule.transform, match });
            }
        }
        return ast;
    }

    astToHtml(ast) {
        let html = '';
        for (const node of ast) {
            const transformFunction = transformFunctions[node.type];
            switch (node.type) {
                case 'headingTransform':
                    const level = node.match[0].split(' ')[0].length;
                    const content = node.match[0].substring(level + 1).trim();
                    html += transformFunction(level, content);
                    break;
                case 'listTransform':
                    html += transformFunction(node.match[2]);
                    break;
                case 'linkTransform':
                    html += transformFunction(node.match[1], node.match[2]);
                    break;
                case 'mathTransform':
                    html += transformFunction(node.match[1]);
                    break;
                default:
                    html += transformFunction(node.match[1] || node.match[0]);
                    break;
            }
        }
        return html;
    }

    parse(text) {
        const ast = this.parseToAST(text);
        return this.astToHtml(ast);
    }
}

module.exports = MarkdownParser;
