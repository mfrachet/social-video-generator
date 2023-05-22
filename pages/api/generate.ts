import {exec} from 'node:child_process';
import fs from 'node:fs';
import {promisify} from 'node:util';
import * as fsExtra from 'fs-extra';

import {NextApiRequest, NextApiResponse} from 'next';
import path from 'node:path';
const execAsync = promisify(exec);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const composition = req.query.composition;

	fsExtra.emptyDirSync('out');
	const filePath = path.join('out', `${composition}.mp4`);

	await execAsync(
		`pnpm remotion render remotion/index.tsx ${composition} out/${composition}.mp4 --props=${req.body}`
	);

	res.setHeader('Content-Type', 'video/mp4');
	res.setHeader(
		'Content-Disposition',
		`attachment; filename="${composition}.mp4"`
	);

	fs.createReadStream(filePath).pipe(res);
};

export default handler;
