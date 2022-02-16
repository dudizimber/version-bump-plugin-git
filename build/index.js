"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStrategies = void 0;
const GitCommitSubjectStrategy_1 = __importDefault(require("./GitCommitSubjectStrategy"));
function getStrategies() {
    return [GitCommitSubjectStrategy_1.default];
}
exports.getStrategies = getStrategies;
//# sourceMappingURL=index.js.map