const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const { StringDecoder } = require('string_decoder');

const ZELDA = path.resolve(__dirname, 'node_modules/zelda-cli/bin/zelda');

let server;

const runCMD = (cmd, arg, opt, mainContent) => {
  mainContent && mainContent.send('z-log', '------ action ------');

  let cli;

  if (process.env.NODE_ENV === 'development') {
    cli = childProcess.spawn(cmd, arg, opt);
  } else {
    cli = childProcess.spawn(
      process.env.SHELL,
      [
        '-i',
        '-c',
        'launchctl setenv PATH "$PATH" && ' + cmd + ' ' + arg.join(' ')
      ],
      opt
    );
  }

  cli.stdout.on('data', data => {
    const output = new StringDecoder('utf8').write(data);
    mainContent && mainContent.send('z-log', output);
  });

  cli.stderr.on('data', data => {
    const output = new StringDecoder('utf8').write(data);
    mainContent && mainContent.send('z-log', output);
  });

  cli.on('close', () => {
    mainContent && mainContent.send('z-log', '------ finish ------');
  });

  return cli;
};

const init = ({ dest, install }, mainContent) => {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest);
  }

  const arg = install ? ['init'] : ['init', '--no-install'];

  runCMD(
    ZELDA,
    arg,
    {
      cwd: dest
    },
    mainContent
  );
};

const link = ({ dest, config, install }, mainContent) => {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest);
  }

  const arg = install ? ['link', config] : ['link', config, '--no-install'];

  runCMD(
    ZELDA,
    arg,
    {
      cwd: dest
    },
    mainContent
  );
};

const generate = ({ dest, type, name, option }, mainContent) => {
  const arg = ['generate', type, name, option];

  runCMD(
    ZELDA,
    arg,
    {
      cwd: dest
    },
    mainContent
  );
};

const npm = ({ dest, type }, mainContent) => {
  const arg = ['run', type];

  runCMD(
    'npm',
    arg,
    {
      cwd: dest
    },
    mainContent
  );
};

const dev = ({ dest, type }, mainContent) => {
  if (server && server.pid) {
    process.kill(-server.pid);
    server = null;
  }

  if (type === 'start') {
    server = runCMD(
      'npm',
      ['start'],
      {
        cwd: dest,
        detached: true
      },
      mainContent
    );
  } else {
    mainContent && mainContent.send('z-log', 'Server is Stopped');
  }
};

module.exports = {
  init,
  link,
  generate,
  npm,
  dev
};
