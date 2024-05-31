module.exports = ({github, context, core}) => {
    console.log(github, context);
    const {GITHUB_BASE_REF, GITHUB_HEAD_REF} = process.env;
    console.log('base ref = ' + GITHUB_BASE_REF);
    console.log('head ref = ' + GITHUB_HEAD_REF);
    if (GITHUB_HEAD_REF !== 'next' && !GITHUB_HEAD_REF.startsWith('hotfix') && GITHUB_BASE_REF === 'main') {
        core.setFailed(`Merge requests to 'main' branch are only allowed from 'next' branch or branches with a name starting with 'hotfix'`);
    }
}
