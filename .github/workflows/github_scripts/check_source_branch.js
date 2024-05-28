module.exports = ({github, context, core}) => {
    console.log(github, context);
    const {GITHUB_BASE_REF, GITHUB_HEAD_REF} = process.env;
    if (GITHUB_HEAD_REF !== 'next' && !GITHUB_HEAD_REF.startsWith('hotfix') && GITHUB_BASE_REF === 'main') {
        core.setFailed(`Merge requests to main branch are only allowed from next branch or branches with a name that starts with hotfix`);
    }
}
