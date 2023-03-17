import { BaseVersionStrategy, BUMP_LEVEL, IVersionBump } from 'version-bump-updated';
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
export default class GitCommitSubjectStrategy extends BaseVersionStrategy {
    static strategyShortName: string;
    static getCommandConfig(): {
        command: string;
        describe: string;
        builder: (yargs: any) => void;
    };
    /**
     * Returns the next release version to update the versionFile with.
     */
    getNextVersion(): Promise<IVersionBump.ParsedSemVerResult>;
    _determineBumpLevel(message: any): BUMP_LEVEL;
}
