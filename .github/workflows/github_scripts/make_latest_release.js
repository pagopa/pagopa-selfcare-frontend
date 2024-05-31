module.exports = async ({github, context}) => {
    const {RELEASE_TAG} = process.env

    const release = await github.rest.repos.getReleaseByTag({
        owner: context.repo.owner,
        repo: context.repo.repo,
        tag: RELEASE_TAG
    });

    await github.rest.repos.updateRelease({
        owner: context.repo.owner,
        repo: context.repo.repo,
        release_id: release.data.id,
        prerelease: false,
        make_latest: true
    });
}
