import Glob from "./glob";
import GlObject from "./globject";
import Result from "./result";
import {except, merge} from "./utils";

function evaluatePattern(pattern, source, result) {
  var glob = new Glob(pattern);
  var method;
  var candidates;
  var dirMatches;
  var fileMatches;

  if (glob.isInverse) {
    method = except;
    candidates = result;
  } else {
    method = merge;
    candidates = source;
  }

  dirMatches = glob.match(candidates.dirs);
  fileMatches = [];
  //unless glob.directory? || glob.exact_match? && !dir_matches.empty?
  if (!glob.isDirectory && (!glob.isExactMatch || !dirMatches.length))
    fileMatches = glob.match(candidates.files);
  if (dirMatches.length)
    result.dirs = method(result.dirs, dirMatches);
  if (fileMatches.length)
    result.files = method(result.files, fileMatches);
}

function evaluatePatterns(patterns, source, result) {
  var pattern;
  var i;
  var len;
  for (i = 0, len = patterns.length; i < len; i++) {
    pattern = patterns[i];
    if (!pattern.match(/^[^#]/)) continue;
    evaluatePattern(pattern, source, result);
  }
}

var Globby = {
  select: function(patterns, source) {
    if (source === null || typeof source === 'undefined')
      source = GlObject.all();

    var result = new GlObject();
    var dirs = result.dirs;
    var dirPatterns;
    var i;
    var len;

    evaluatePatterns(patterns);

    if (dirs && (len = dirs.length)) {
      // now go merge/subtract files under directories
      dirPatterns = [];
      for (i = 0; i < len; i++) {
        dirPatterns.push("/" + dirs[i] + "**");
      }
      evaluatePatterns(dirPatterns, new GlObject(source.files), result);
    }

    return new Result(result.files, source.dirs);
  },

  reject: function(patterns, source) {
    if (source === null || typeof source === 'undefined')
      source = GlObject.all();

    return new Result(except(source.files, this.select(patterns, source), source.dirs));
  }
};

export default Globby;
