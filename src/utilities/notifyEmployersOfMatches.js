const sendEmail = require('../email/sendMail');
const { findDevelopersBySkills } = require('../models/developer');

async function notifyEmployersOfMatches() {
  const employers = await global.atlan.retrieve('employer', {});
  for (let employer of employers) {
    const skillsWanted = employer.skills;
    const developers = await findDevelopersBySkills(skillsWanted);
    if (developers.length !== 0) {
      const content = [];
      content.push(`Hello ${employer.email}:`);
      content.push(`We have found developers that match your criteria: ${skillsWanted.join(', ')}:`);
      developers.sort((a, b) => {
        const a_ = skillsWanted.filter(value => {
          return a.skills.includes(value);
        }).length;
        const b_ = skillsWanted.filter(value => {
          return b.skills.includes(value);
        }).length;
        return a_ - b_;
      });
      for (let developer of developers) {
        content.push(`\t* ${developer.email} has skills: ${developer.skills.join(', ')}.`);
      }
      content.push('Regards from GMT!');
      const content_ = content.join('\n');
      sendEmail(employer.email, `${developers.length} new match${developers.length > 1 ? 'es' : ''} found!`, content_);
    }
  }
}

module.exports = notifyEmployersOfMatches;
