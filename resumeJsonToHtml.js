const resumeJSON = require('./resume.json');

const stylesheet = '<link rel="stylesheet" href="index.css">'
const indentType = "  ";

function wrap(element, indent, content) {
  const indentation = indentType.repeat(indent);
  return `\n${indentation}<${element}>\n${indentation + indentType}${content}\n${indentation}</${element}>`;
}

function createList(listType, indent, content) {
  return wrap(listType, indent, content.map(listItem => {
    return wrap("li", indent + 1, listItem)
  }).join(''));
}

function createHTML(resume) {
  const baseIndent = 0;
  return wrap("html", baseIndent, `${wrap("head", baseIndent + 1, stylesheet)}${wrap("body", baseIndent + 1, createBody(resume, baseIndent + 1))}`
  );
}

function createBody(resume, indent) {
  return Object.keys(resume).map(section => {
    return wrap("section", indent + 1, createSection({
      name: section,
      content: resume[section],
    }, indent + 2));
  }).join('');
}

function createSpecificSection(section, indent) {
  const { name, content } = section;

  switch(name) {
    case "basics":
      return Object.keys(content).map(basic => {
        return wrap("p", indent, `${basic}: ${content[basic]}`);
      }).join('');

    case "technologies":
      return createList("ul", indent, content.map(technology => {
        return `${technology.description}${createList("ul", indent + 2, technology.list)}`;
      }));

    case "career_history":
      return content.map(job => {
        return wrap("article", indent, 
            wrap("h2", indent + 1, `${job.company} - ${job.position} (${job.begin}-${job.end})`) +
            createList("ul", indent + 1, job.notes));
      }).join('');
    
    case "education":
      return wrap("h3", indent, `${content.degrees.join(' and ')} - ${content.university}`);

    case "life_achievements":
      return createList("ul", indent, content);

    case "references":
      return `${wrap("p", indent, content.description)}${createList("ul", indent, content.persons)}`;

    default:
      return name;
  }
}

function createSection(section, indent) {
  return `${wrap("h1", indent, section.name)}${createSpecificSection(section, indent)}`;
}

console.log(createHTML(resumeJSON));
