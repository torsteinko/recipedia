import RecipeIngredients from '@components/recipe/RecipeIngredients';
import { Comment } from '@mui/icons-material';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { styled } from '@mui/system';
import * as React from 'react';
import { RecipeProps } from 'src/types/recipe';
import RecipeComments from './RecipeComments';
import RecipeRating from '@components/recipe/RecipeRating';
import { UserProps } from 'src/types/user';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

// TODO: Do this in a more clean way= maybe with a Typography instead of StyledParagraph?
const StyledParagraph = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  height: 300,
}));

interface Props {
  recipe: RecipeProps;
}

const RecipeTab = ({ recipe }: Props) => {
  const { instructions } = recipe;
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const instructionList = instructions.split("\r\n")

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" variant="scrollable" scrollButtons="auto">
          <Tab label="Ingredienser" {...a11yProps(0)} />
          <Tab label="Fremgangsmåte" {...a11yProps(1)} />
          <Tab label="Vurdering" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <RecipeIngredients recipe={recipe} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ol>
          {instructionList.map((instruction: string, id: number) => (
            <Typography key={id} variant="body1" component="li" sx={{ mb: 1 }}>{instruction}</Typography>
          ))}
        </ol>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <RecipeRating recipe={recipe} />
        <RecipeComments recipe={recipe} />
      </TabPanel>
    </Box>
  );
}

export default RecipeTab;