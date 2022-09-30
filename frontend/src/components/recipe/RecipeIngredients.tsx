import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { Box, IconButton, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import * as React from 'react';
import { useEffect, useState } from "react";
import { RecipeProps } from 'src/types/recipe';

interface Props {
  recipe: RecipeProps;
}

const RecipeIngredients = ({ recipe }: Props) => {
  const { ingredients } = recipe;

  /* Maintains the state of portionSize and the amount for each ingredient*/
  const [portionValue, setPortionValue] = useState(recipe.portionSize);
  const [ingredientsValue, setIngredientsValue] = useState(ingredients);

  /* Updates portionValue when the subtract button is pressed */
  const subtract = () => setPortionValue(portionValue - 1);

  /* Updates portionValue when the add button is pressed */
  const add = () => setPortionValue(portionValue + 1);

  /* Updates the ingredient amounts when it notices a change in portionValue */
  useEffect(() => {
    setIngredientsValue(ingredients.map((element, index) => {
      return { ...element, amount: ingredients[index].amount * (portionValue / recipe.portionSize) };
    }))

  }, [portionValue, recipe])


  return (
    <TableContainer component={Paper}>
      {/* Box with the portion buttons and information about portionValue */}
      <Box sx={{ alignContent: 'space-between' }}>
        <Box sx={{ flexDirection: 'row', display: 'flex', mx: 2, mb: 1 }}>
          <Typography>Porsjoner</Typography>
        </Box>
        <Box sx={{ flexDirection: 'row', display: 'flex', mx: 1 }}>
          {portionValue < 2 ? (
            <IconButton aria-label="decrease" disabled onClick={subtract}>
              <RemoveCircleIcon />
            </IconButton>) : (
            <IconButton aria-label="decrease" onClick={subtract}>
              <RemoveCircleIcon />
            </IconButton>)}
          <Typography variant="h3" sx={{ mx: 1 }}> {portionValue} </Typography>
          <IconButton aria-label="increase" onClick={add}>
            <AddCircleIcon />
          </IconButton>
        </Box>
      </Box>
      <Table sx={{ minWidth: 60 }} aria-label="simple table">
        {/* Table with information about ingredients connected to the recipe */}
        <TableHead>
          <TableRow>
            <TableCell>Ingredienser</TableCell>
            <TableCell align="right">Mengde</TableCell>
            <TableCell align="left">Enhet</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ingredientsValue.map((ingredient) => (
            <TableRow
              key={ingredient.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {ingredient.name}
              </TableCell>
              {/* ingredient.amount is rounded up to keep the number of decimals to just 2 */}
              <TableCell align="right">{Math.round((ingredient.amount + Number.EPSILON) * 100) / 100}</TableCell>
              <TableCell align="left">{ingredient.unit}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default RecipeIngredients;