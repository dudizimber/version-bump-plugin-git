"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __importDefault(require("util"));
const version_bump_updated_1 = require("version-bump-updated");
const git_last_commit_1 = require("git-last-commit");
const getLastCommitAsync = util_1.default.promisify(git_last_commit_1.getLastCommit);
/**
 * Performs a version bump if the git commit subject contains the following:
 * - [major]
 * - [minor]
 * - [patch]
 * - [pre-release] Bumps the pre version for the first found integer version
 * - [build-release] Bumps the build version for the first found integer version
 *
 * If there are no tags defined, then the lowest level is assumed.
 *
 * See https://github.com/asamuzaK/semverParser#parsesemverversion-strict for more information.
 */
class GitCommitSubjectStrategy extends version_bump_updated_1.BaseVersionStrategy {
    static getCommandConfig() {
        return {
            command: GitCommitSubjectStrategy.strategyShortName,
            describe: `Uses the last git commit subject to determine the bump level. Will bump based on the following text:

          * [major]
          * [minor]
          * [patch]
          * [pre-major]
          * [pre-minor]
          * [pre-patch]
          * [pre-release]
          * [build-release]

        Default is the lowest version possible.

        You can also pass the commit message as an argument to this command.
        `,
            builder: yargs => {
                yargs.option('message', {
                    describe: 'The commit message to use to determine the bump level.'
                });
            }
        };
    }
    /**
     * Returns the next release version to update the versionFile with.
     */
    async getNextVersion() {
        var _a, _b;
        // get the last commit message
        console.log('this.getOptions()', this.getOptions());
        const { subject } = !!((_a = this.getOptions()) === null || _a === void 0 ? void 0 : _a.message)
            ? { subject: (_b = this.getOptions()) === null || _b === void 0 ? void 0 : _b.message }
            : await getLastCommitAsync();
        // analyze the commit message to determine what bump level to use
        const bumpLevel = this._determineBumpLevel(subject);
        // get the current version manifest
        let versionData = this.getCurrentVersion();
        // bump the manifest based on the bump level
        return version_bump_updated_1.bumpVersionData(versionData, bumpLevel, {
            logger: this.getLogger()
        }, this.options.restartBuildVersion);
    }
    _determineBumpLevel(message) {
        if (!message || typeof message !== 'string') {
            return version_bump_updated_1.BUMP_LEVEL.LOWEST;
        }
        if (message.includes('[major]')) {
            return version_bump_updated_1.BUMP_LEVEL.MAJOR;
        }
        if (message.includes('[minor]')) {
            return version_bump_updated_1.BUMP_LEVEL.MINOR;
        }
        if (message.includes('[patch]')) {
            return version_bump_updated_1.BUMP_LEVEL.PATCH;
        }
        if (message.includes('[pre-major]')) {
            return version_bump_updated_1.BUMP_LEVEL.PRE_MAJOR;
        }
        if (message.includes('[pre-minor]')) {
            return version_bump_updated_1.BUMP_LEVEL.PRE_MINOR;
        }
        if (message.includes('[pre-patch]')) {
            return version_bump_updated_1.BUMP_LEVEL.PRE_PATCH;
        }
        if (message.includes('[pre-release]')) {
            return version_bump_updated_1.BUMP_LEVEL.PRE_RELEASE;
        }
        if (message.includes('[build-release]')) {
            return version_bump_updated_1.BUMP_LEVEL.BUILD_RELEASE;
        }
        return version_bump_updated_1.BUMP_LEVEL.LOWEST;
    }
}
exports.default = GitCommitSubjectStrategy;
GitCommitSubjectStrategy.strategyShortName = 'git-commit-subj';
//# sourceMappingURL=GitCommitSubjectStrategy.js.map