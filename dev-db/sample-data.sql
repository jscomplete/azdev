TRUNCATE TABLE azdev.users RESTART IDENTITY CASCADE;
TRUNCATE TABLE azdev.tasks RESTART IDENTITY CASCADE;
TRUNCATE TABLE azdev.tags RESTART IDENTITY CASCADE;
TRUNCATE TABLE azdev.task_tags RESTART IDENTITY CASCADE;
TRUNCATE TABLE azdev.approaches RESTART IDENTITY CASCADE;
TRUNCATE TABLE azdev.approach_details RESTART IDENTITY CASCADE;
TRUNCATE TABLE azdev.approach_votes RESTART IDENTITY CASCADE;

INSERT INTO "azdev"."users"("id", "username", "email","hashed_password","first_name","last_name","hashed_auth_token","auth_token_expires_at","hashed_renew_token","renew_token_expires_at")
VALUES
(E'42',E'test1',E'test@az.dev',crypt('123', gen_salt('bf')),E'Test',E'Account',crypt('test-token', gen_salt('bf')),NULL,NULL,NULL);

INSERT INTO "azdev"."tasks"("id","content","created_by","is_private","published_at","published_by")
VALUES
(E'caluclate-the-sum-of-numbers-in-javascript-array-c164924d0d',E'Caluclate the sum of numbers in a JavaScript array','42',FALSE,E'2021-03-03', 42),
(E'get-rid-of-only-the-unstaged-changes-since-the-last-a6c5417ca1',E'Get rid of only the unstaged changes since the last git commit','42',FALSE,E'2021-03-03', 42),
(E'the-syntax-for-switch-statement-aka-case-statement-in-javascript-60c3102eeb',E'The syntax for a switch statement (AKA case statement) in JavaScript','42',FALSE,E'2021-03-03', 42),
(E'babel-configuration-file-for-react-and-env-presets-78a83a423c',E'Babel configuration file for "react" and "env" presets','42',TRUE,E'2021-03-03', 42),
(E'create-secure-one-way-hash-for-text-value-like-password-84e3583605',E'Create a secure one-way hash for a text value (like a password) in Node','42',FALSE,E'2021-03-03', 42);

INSERT INTO "azdev"."tags"("id","title","created_by","published_at","published_by")
VALUES
(E'code',E'code',E'42',E'2021-03-03', 42),
(E'command',E'command',E'42',E'2021-03-03', 42),
(E'git',E'git',E'42',E'2021-03-03', 42),
(E'config',E'config',E'42',E'2021-03-03', 42),
(E'javascript',E'javascript',E'42',E'2021-03-03', 42),
(E'node',E'node',E'42',E'2021-03-03', 42);

INSERT INTO "azdev"."task_tags"("created_by","task_id","tag_id","published_at","published_by")
VALUES
(E'42',E'caluclate-the-sum-of-numbers-in-javascript-array-c164924d0d',E'code',E'2021-03-03', 42),
(E'42',E'caluclate-the-sum-of-numbers-in-javascript-array-c164924d0d',E'javascript',E'2021-03-03', 42),
(E'42',E'get-rid-of-only-the-unstaged-changes-since-the-last-a6c5417ca1',E'command',E'2021-03-03', 42),
(E'42',E'get-rid-of-only-the-unstaged-changes-since-the-last-a6c5417ca1',E'git',E'2021-03-03', 42),
(E'42',E'the-syntax-for-switch-statement-aka-case-statement-in-javascript-60c3102eeb',E'code',E'2021-03-03', 42),
(E'42',E'the-syntax-for-switch-statement-aka-case-statement-in-javascript-60c3102eeb',E'javascript',E'2021-03-03', 42),
(E'42',E'babel-configuration-file-for-react-and-env-presets-78a83a423c',E'config',E'2021-03-03', 42),
(E'42',E'babel-configuration-file-for-react-and-env-presets-78a83a423c',E'javascript',E'2021-03-03', 42),
(E'42',E'babel-configuration-file-for-react-and-env-presets-78a83a423c',E'node',E'2021-03-03', 42),
(E'42',E'create-secure-one-way-hash-for-text-value-like-password-84e3583605',E'code',E'2021-03-03', 42),
(E'42',E'create-secure-one-way-hash-for-text-value-like-password-84e3583605',E'node',E'2021-03-03', 42);

INSERT INTO "azdev"."approaches"("id","content","created_by","task_id","vote_count","sort_rank","published_at","published_by")
VALUES
(E'arrayofnumbers-reduce-acc-curr-acc-curr-4bca3c1ba5',E'arrayOfNumbers.reduce((acc, curr) => acc + curr, 0)','42',E'caluclate-the-sum-of-numbers-in-javascript-array-c164924d0d',0,NULL,E'2021-03-03', 42),
(E'git-diff-git-apply-reverse-5a8eefd5ad',E'git diff | git apply --reverse','42',E'get-rid-of-only-the-unstaged-changes-since-the-last-a6c5417ca1',0,NULL,E'2021-03-03', 42),
(E'switch-expression-case-value1-do-something-when-expression-value1-break-52d1aca0e6',E'switch (expression) {\n  case value1:\n    // do something when expression === value1\n    break;\n  case value2:\n    // do something when expression === value2\n    break;\n  default:\n    // do something when expression does not equal any of the values above\n}','42',E'the-syntax-for-switch-statement-aka-case-statement-in-javascript-60c3102eeb',0,NULL,E'2021-03-03', 42),
(E'function-dosomethingfor-expression-switch-expression-case-value1-do-something-when-4faada7899',E'function doSomethingFor(expression) {\n  switch (expression) {\n    case value1:\n      // do something when expression === value1\n      return;\n    case value2:\n      // do something when expression === value2\n      return;\n    default:\n      // do something when expression does not equal any of the values above\n  }\n}','42',E'the-syntax-for-switch-statement-aka-case-statement-in-javascript-60c3102eeb',0,NULL,E'2021-03-03', 42),
(E'module-exports-presets-babel-react-babel-env-modules-commonjs-targets-969254f933',E'module.exports = {\n  presets: [\n    \'@babel/react\',\n    [\n      \'@babel/env\',\n      {\n        modules: \'commonjs\',\n        targets: [\n          \'> 1%\',\n          \'last 3 versions\',\n          \'ie >= 9\',\n          \'ios >= 8\',\n          \'android >= 4.2\',\n        ],\n      },\n    ],\n  ]\n};','42',E'babel-configuration-file-for-react-and-env-presets-78a83a423c',0,NULL,E'2021-03-03', 42),
(E'const-bcrypt-require-bcrypt-const-hashedpass-bcrypt-hashsync-testpass123-10-93ab24cabb',E'const bcrypt = require(\'bcrypt\');\nconst hashedPass = bcrypt.hashSync(\'testPass123\', 10);','42',E'create-secure-one-way-hash-for-text-value-like-password-84e3583605',0,NULL,E'2021-03-03', 42);

INSERT INTO "azdev"."approach_details"("category","content","created_by","approach_id","sort_rank","published_at","published_by")
VALUES
(E'explanation',E'The `reduce` method invokes its callback function (the first argument) on every item in `arrayOfNumbers`. Each invokation supplies the callback function with an "accumulator" argument and the "current" item for that invokation. What the callback function returns becomes the new value for the accumulator. The initial value of the accumulator is the second argument to `reduce`. By starting with 0 and always returning the sum of the accumulator and the current number in the array, the final result will be the sum of all numbers in `arrayOfNumbers`.','42',E'arrayofnumbers-reduce-acc-curr-acc-curr-4bca3c1ba5',NULL,E'2021-03-03', 42),
(E'note',E'This will work if you have staged changes (that you want to keep) or even untracked files. It will only git rid of the unstaged changes.','42',E'git-diff-git-apply-reverse-5a8eefd5ad',NULL,E'2021-03-03', 42),
(E'note',E'The `break` statements are tasked. Without them, JavaScript will continue to execute all the lines in all the other cases after the one that was matched. That is rarely the intended behaviour (altough you can use it to define multiple cases that are intended to execute the same code. For example, do something if `expression` equals either `value1` or `value2`)','42','switch-expression-case-value1-do-something-when-expression-value1-break-52d1aca0e6',NULL,E'2021-03-03', 42),
(E'explanation',E'Because the function returns for each case, there is no task to "break" out of that case. You can make the function optionally return a value based on the expression as well.','42',E'function-dosomethingfor-expression-switch-expression-case-value1-do-something-when-4faada7899',NULL,E'2021-03-03', 42),
(E'note',E'This will only work for Babel versions > 7.x. Older Babels require a different configuration.','42',E'module-exports-presets-babel-react-babel-env-modules-commonjs-targets-969254f933',NULL,E'2021-03-03', 42),
(E'explanation',E'The second argument to hashSync (or hash) is for the "salt" to be used to hash the text. When specified as a number then a salt will be generated with the specified number of rounds and used.','42',E'const-bcrypt-require-bcrypt-const-hashedpass-bcrypt-hashsync-testpass123-10-93ab24cabb',NULL,E'2021-03-03', 42),
(E'note',E'To do the hasing asynchronously, use the `bycrypt.hash` method. It returns a promise.','42',E'const-bcrypt-require-bcrypt-const-hashedpass-bcrypt-hashsync-testpass123-10-93ab24cabb',NULL,E'2021-03-03', 42),
(E'note',E'To compare hashed texts together, bcrypt has a `compareSync` (and `compare`) methods','42',E'const-bcrypt-require-bcrypt-const-hashedpass-bcrypt-hashsync-testpass123-10-93ab24cabb',NULL,E'2021-03-03', 42);

INSERT INTO "azdev"."approach_votes"("approach_id", "created_by", "vote")
VALUES
(E'arrayofnumbers-reduce-acc-curr-acc-curr-4bca3c1ba5', '42', -1),
(E'function-dosomethingfor-expression-switch-expression-case-value1-do-something-when-4faada7899', '42', 1);
