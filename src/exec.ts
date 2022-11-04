import * as core from '@actions/core';
import * as exec from '@actions/exec';

export const prettyExec = async (command: string, args?: string[], option?: exec.ExecOptions) => {
  const cmdStr = `${command} ${args?.join(' ') ?? ''}`;
  console.time(`>>> "${cmdStr}"`);
  const buffers: string[] = [];
  const output = await exec.getExecOutput(command, args, {
    silent: true,
    ignoreReturnCode: true,
    listeners: {
      stdline: (s) => buffers.push(`[stdout] ${s}`),
      stderr: (s) => buffers.push(`[stderr] ${s}`),
    },
    ...option,
  });
  const code = output.exitCode === 0 ? '' : ` exit code: ${output.exitCode}`;
  console.timeEnd(`>>> "${cmdStr}"`);
  core.startGroup(`>>> "${cmdStr}"`);
  buffers.forEach(core.info);
  core.endGroup();
  if (output.exitCode !== 0) {
    throw Error(`Error: The process "${cmdStr}" failed with exit code: ${code}`);
  }
  return output;
};
