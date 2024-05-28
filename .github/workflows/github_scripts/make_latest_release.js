module.exports = async ({github, context, core}) => {
    var latest = await github.rest.repos.getLatestRelease({
        owner: context.repo.owner,
        repo: context.repo.repo,
    });

    await github.rest.repos.updateRelease({
        owner: context.repo.owner,
        repo: context.repo.repo,
        release_id: latest.data.id,
        prerelease: false
    });
}
