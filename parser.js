const fs = require('fs');
const yaml = require('js-yaml');

// Define the transformation functions
const transformFunctions = {
    headingTransform: (match) => {
        const level = match[0].split(' ')[0].length;
        const content = match[0].substring(level + 1).trim();
        return `<h${level}>${content}</h${level}>`;
    },
    boldTransform: (match) => {
        const content = match[1];
        return `<strong>${content}</strong>`;
    },
    italicTransform: (match) => {
        const content = match[1];
        return `<em>${content}</em>`;
    },
    codeTransform: (match) => {
        const content = match[1];
        return `<code>${content}</code>`;
    },
    listTransform: (match) => {
        const indent = match[1].replace(/ /g, "&nbsp;");
        const content = match[2];
        return `${indent}• ${content}`;
    },
    linkTransform: (match) => {
        const text = match[1];
        const url = match[2];
        return `<a href="${url}">${text}</a>`;
    },
    mathTransform: (match) => {
        const content = match[1];
        return `\\(${content}\\)`; // Wrap math formulas with MathJax tags
    }
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

    parse(text) {
        for (const rule of this.rules) {
            const pattern = new RegExp(rule.regex, 'gm');
            const transformFunction = transformFunctions[rule.transform];
            text = text.replace(pattern, (match, ...args) => {
                return transformFunction([match, ...args]);
            });
        }
        return text;
    }
}

module.exports = MarkdownParser;
