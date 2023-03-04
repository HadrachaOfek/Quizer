import CheckBox from '@mui/icons-material/CheckBox';
import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	Checkbox,
	Divider,
	FormControlLabel,
	FormGroup,
	Paper,
	Radio,
	RadioGroup,
	Typography,
} from '@mui/material';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import React from 'react';
import { useState } from 'react';
import { Stack } from '@mui/system';
import { useEffect } from 'react';

function QuestionCard({
	selected,
	id,
	onSelect,
	question,
	img,
	onMark,
	onDemark,
	answers,
	type,
}) {
	const [isMarked, setIsMarked] = useState(false);
	const [selectedAnswers, setSelectedAnswers] = useState(selected || []);

	useEffect(
		_ => {
			isMarked && onMark(id);
			!isMarked && onDemark(id);
		},
		[isMarked]
	);
	const handleSelection = ans => {
		if (type === 'חד בחירה') {
			setSelectedAnswers([ans]);
		} else {
			if (selectedAnswers.indexOf(ans) != -1) {
				setSelectedAnswers(selectedAnswers.filter(e => e !== ans));
			} else {
				setSelectedAnswers(selectedAnswers.concat([ans]));
			}
		}
	};

	useEffect(
		_ => {
			onSelect && onSelect(selectedAnswers);
		},
		[selectedAnswers]
	);
	return (
		<Card
			id={id}
			variant='outlined'
			spacing={1}
			sx={{
				width: '100%',
				borderRadius: '20px',
				padding: '20px',
				height: 'fit-content',
			}}>
			<CardHeader title={question} />
			<CardContent>
				{img ? (
					<img
						src={img}
						style={{
							width: '100%',
							height: '200px',
							objectFit: 'contain',
						}}
					/>
				) : undefined}
				<FormGroup>
					{answers.map((e, index) => (
						<FormControlLabel
							key={index}
							onClick={_ => handleSelection(e)}
							value={e}
							checked={selectedAnswers.indexOf(e) !== -1}
							control={
								type === 'חד בחירה' ? <Radio /> : <Checkbox />
							}
							label={e}
						/>
					))}
				</FormGroup>
			</CardContent>
			<CardActions>
				<Button onClick={e => setIsMarked(!isMarked)}>
					{isMarked ? <BookmarkRemoveIcon /> : <BookmarkAddIcon />}
					{isMarked ? ' בטל סימון' : ' סימון שאלה'}{' '}
				</Button>
				<Button onClick={e => setSelectedAnswers([])}>אפס שאלה</Button>
			</CardActions>
		</Card>
	);
}

export default QuestionCard;
