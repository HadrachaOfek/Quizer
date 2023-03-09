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
	TextField,
	Typography,
} from '@mui/material';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import React from 'react';
import { useState } from 'react';
import { Stack } from '@mui/system';
import { useEffect } from 'react';
import { read } from 'xlsx';

function QuestionCard({
	readOnly = false,
	selected,
	id,
	onSelect = () => undefined,
	question,
	img,
	onMark = () => undefined,
	onDemark = () => undefined,
	answers,
	type,
}) {
	const [isMarked, setIsMarked] = useState(false);
	const [selectedAnswers, setSelectedAnswers] = useState(selected || []);
	const [textFieldValue, setTextFieldValue] = useState(
		selected ? selected[0] : ''
	);
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
		} else if (type === 'שאלה פתוחה') {
			if (ans.trim()) setSelectedAnswers([ans]);
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
				{type !== 'שאלה פתוחה' && (
					<FormGroup>
						{answers.map((e, index) => (
							<FormControlLabel
								key={index}
								disabled={readOnly}
								onClick={_ => handleSelection(e)}
								value={e}
								checked={selectedAnswers.indexOf(e) !== -1}
								control={
									type === 'חד בחירה' ? (
										<Radio readOnly={readOnly} />
									) : (
										<Checkbox readOnly={readOnly} />
									)
								}
								label={e}
							/>
						))}
					</FormGroup>
				)}
				{type === 'שאלה פתוחה' ? (
					<TextField
						fullWidth
						disabled={readOnly}
						multiline={true}
						value={textFieldValue}
						onBlur={e => handleSelection(e.target.value)}
						onChange={e => setTextFieldValue(e.target.value)}
					/>
				) : undefined}
			</CardContent>
			{!readOnly && (
				<CardActions>
					<Button onClick={e => setIsMarked(!isMarked)}>
						{isMarked ? (
							<BookmarkRemoveIcon />
						) : (
							<BookmarkAddIcon />
						)}
						{isMarked ? ' בטל סימון' : ' סימון שאלה'}{' '}
					</Button>
					<Button onClick={e => setSelectedAnswers([])}>
						אפס שאלה
					</Button>
				</CardActions>
			)}
		</Card>
	);
}

export default QuestionCard;
