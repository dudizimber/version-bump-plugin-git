import {
  BaseVersionStrategy,
  BUMP_LEVEL,
  bumpVersionData,
  parseOptions
} from '@theo.gravity/version-bump'

/**
 * Performs a version bump based on the --bump flag
 * eg:
 * --bump patch
 * --bump minor
 * --bump major
 * --bump pre
 * --bump pre:<colon-separated-tags> eg (pre:alpha)
 * --bump build
 * --bump build:<colon-separated-tags> eg (build:qa)
 */
export default class CliBumpStrategy extends BaseVersionStrategy {
  static description = 'Performs a version bump based on command line options.'

  async init () {
    this.strategyOptions = await parseOptions(this.options.strategyOptions) || {}
    this.bump = this.strategyOptions.bump
  }

  initCliOptions (program) {
    program
      .command(`${this.getStrategyName()} <options>`)
      .description(CliBumpStrategy.description)
      .option('-b, --bump <bump_type>', `Bump the version based on <bump_type>. Values can be:
                                            * major
                                            * minor
                                            * patch
                                            * pre
                                            * build
                                            * pre:<colon-sep-tags> (pre:alpha:rc)
                                            * build:<colon-sep-tags> (build:qa)

                                         Default is the lowest version possible.`)
  }

  /**
   * Returns the next release version to update the versionFile with.
   * @returns {Promise<Object>} semver parsed object
   */
  async getNextVersion () {
    const bumpLevel = this._determineBumpLevel(this.bump)
    let versionData = this.getCurrentVersion()

    versionData = bumpVersionData(versionData, bumpLevel)

    // check if the pre/build is using any custom tag
    if (typeof this.bump === 'string' && (this.bump.includes('pre:') || this.bump.includes('build:'))) {
      // extract the tag
      let tags = this.bump.split(':')

      // remove the 0th entry since that's the pre/build label
      tags.shift()

      // Compare the proposed tags against the existing one
      let compare = []

      switch (bumpLevel) {
        case BUMP_LEVEL.PRE_BUMP:
          compare = versionData.pre
          break
        case BUMP_LEVEL.BUILD_BUMP:
          compare = versionData.build
          break
      }

      if (!tags.every((tag, idx) => tag === compare[idx])) {
        // set the initial pre/build version to 1
        tags.push(1)

        switch (bumpLevel) {
          case BUMP_LEVEL.PRE_BUMP:
            versionData.pre = tags
            break
          case BUMP_LEVEL.BUILD_BUMP:
            versionData.build = tags
            break
        }
      }
    }

    return versionData
  }

  _determineBumpLevel (bumpType) {
    if (!bumpType || typeof bumpType !== 'string') {
      return BUMP_LEVEL.LOWEST
    }

    if (bumpType === 'major') {
      return BUMP_LEVEL.MAJOR
    }

    if (bumpType === 'minor') {
      return BUMP_LEVEL.MINOR
    }

    if (bumpType === 'patch') {
      return BUMP_LEVEL.PATCH
    }

    if (bumpType.includes('pre')) {
      return BUMP_LEVEL.PRE_BUMP
    }

    if (bumpType.includes('build')) {
      return BUMP_LEVEL.BUILD_BUMP
    }

    return BUMP_LEVEL.LOWEST
  }
}
