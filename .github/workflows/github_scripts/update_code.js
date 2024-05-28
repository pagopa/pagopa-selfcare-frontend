module.exports = async ({github, context, core}) => {
    let comments = await github.rest.issues.listComments({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo
    });
    for (const comment of comments.data) {
        if (comment.body.includes('Update Code is failed. Please retry.')) {
            github.rest.issues.deleteComment({
                issue_number: context.issue.number,
                owner: context.repo.owner,
                repo: context.repo.repo,
                comment_id: comment.id
            })
        }
    }
    github.rest.issues.createComment({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
        body: 'Update Code is failed. Please retry.'
    })
    core.setFailed('Update Code is failed. Please retry.')
}
