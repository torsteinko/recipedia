import { useQuery } from "@apollo/client";
import { GET_CATEGORIES } from "@graphql/queries";
import { SettingsInputAntenna } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from '@mui/icons-material/Search';
import { Accordion, AccordionDetails, AccordionSummary, Slider, Divider, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Stack, Typography, Box, ToggleButtonGroup, ToggleButton } from "@mui/material";
import InputBase from '@mui/material/InputBase';
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";



interface Props {
  fetchRecipes: any;
  timerfinder: any;
  setSorting: any;
}

const SearchRecipeModule = ({ fetchRecipes, timerfinder, setSorting }: Props) => {
  const router = useRouter();

  // Input field states
  const [searchValue, setSearchValue] = useState("");
  const [category, setCategory] = useState("0");
  const [sliderValue, setSliderValue] = useState<number[]>([0, 100]);
  const [alignment, setAlignment] = React.useState('↓');

  // Handle search focus state
  const [focused, setFocused] = useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    timerfinder(newValue)
    setSliderValue(newValue as number[]);
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value);
    fetchRecipes({ variables: { name: searchValue, category: (event.target.value == "0" ? undefined : event.target.value) } })
  };

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    setAlignment(newAlignment);
    setSorting(newAlignment)
  };

  const { data: categoryData } = useQuery(GET_CATEGORIES);

  // Fetch all recipes on page load
  useEffect(() => {
    if (router.query.category) {
      setCategory(router.query.category as string)
      fetchRecipes({ variables: { name: searchValue, category: router.query.category } });
    } else {
      fetchRecipes();
    }
  }, [router])

  // Update query variables when form is submitted
  const handleFormSubmit = (e: React.FormEvent) => {
    fetchRecipes({ variables: { name: searchValue, category: (category == "0" ? undefined : category) } })
    e.preventDefault(); // Prevent page refresh
  }

  const clearSearch = () => {
    setSearchValue("")
    fetchRecipes({ variables: { name: "", category: (category == "0" ? undefined : category) } })
  }

  const marks = [
    {
      value: 0,
      label: '0',
    },
    {
      value: 100,
      label: '100',
    },
  ];

  return (
    <>
      <Stack spacing={2} py={2} component="form" onSubmit={handleFormSubmit}>
        <Paper
          elevation={focused ? 14 : 4}
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: "100%" }}
        >
          <InputBase
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            sx={{ ml: 1, flex: 1 }}
            placeholder="Søk oppskrifter"
            inputProps={{ 'aria-label': 'Søk oppskrifter' }}
            value={searchValue} onChange={handleSearchChange}
          />
          {searchValue != "" && (
            <IconButton onClick={clearSearch} sx={{ p: '10px' }} aria-label="fjern søk">
              <CloseIcon sx={{ height: 21, color: "text.disabled" }} />
            </IconButton>
          )}
          <Divider orientation="vertical" flexItem />
          <IconButton type="submit" sx={{ p: '10px' }} aria-label="søk">
            <SearchIcon />
          </IconButton>
        </Paper>

        <Paper variant="outlined">
          <Accordion sx={{ boxShadow: "none" }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <FilterListIcon sx={{ height: 21, mr: 1, color: "text.disabled" }} />
              <Typography variant="body2">Åpne filter</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {categoryData && (
                <FormControl fullWidth>
                  <InputLabel id="category-select-label">Kategori</InputLabel>
                  <Select
                    labelId="category-select-label"
                    id="category-select"
                    value={category as string}
                    defaultValue="0"
                    label="Kategori"
                    onChange={handleCategoryChange}
                  >
                    {categoryData.allCategories.map((category: any) => (
                      <MenuItem value={category.id} key={category.id}>{category.name}</MenuItem>
                    ))}
                    <MenuItem value="0">Alle</MenuItem>
                  </Select>
                </FormControl>
              )}
              <Box sx={{mt: 3, mx: 1}}>
                <InputLabel>Tilberedningstid</InputLabel>
                <Slider
                  getAriaLabel={() => 'Tid'}
                  value={sliderValue}
                  onChange={handleSliderChange}
                  valueLabelDisplay="auto"
                  marks={marks}
                  color="secondary"
                  />
              </Box>
              <Box>
                <InputLabel sx={{my: 1}}>Rangering</InputLabel>
                <ToggleButtonGroup
                  color="primary"
                  value={alignment}
                  exclusive
                  onChange={handleChange}
                >
                  <ToggleButton value="desc">Høy til lav</ToggleButton>
                  <ToggleButton value="asc">Lav til høy</ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Paper>
      </Stack>
    </>
  )
}

export default SearchRecipeModule;