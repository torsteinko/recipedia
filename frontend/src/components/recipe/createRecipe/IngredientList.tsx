import { DeleteOutlineSharp, DragIndicator } from "@mui/icons-material";
import { Button, FormControl, IconButton, List, ListItem, MenuItem, Select, SelectChangeEvent, Stack, TextField } from "@mui/material";
import { ReactSortable } from "react-sortablejs";

const UNIT_CHOICES = [
  {
    value: 'stk',
    label: 'stk',
  },
  {
    value: 'mL',
    label: 'mL',
  },
  {
    value: 'dL',
    label: 'dL',
  },
  {
    value: 'L',
    label: 'L',
  },
  {
    value: 'g',
    label: 'g',
  },
  {
    value: 'kg',
    label: 'kg',
  },
  {
    value: 'ts',
    label: 'ts',
  },
  {
    value: 'ss',
    label: 'ss',
  },
  {
    value: undefined,
    label: "Ingen",
  },
];

interface ItemType {
  id: number;
  name: string;
  amount?: number;
  unit?: string;
}

interface Props {
  state: ItemType[];
  setState: (state: ItemType[]) => void;
}

// Props: external component state is updated with setState
const IngredientList = ({ state, setState }: Props) => {

  // Update set to everything excluding the selected id
  const deleteLine = (id: number) => {
    setState(state.filter(item => item.id != id))
  }

  // Spread operator shit: Update object on index input
  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    setState([
      ...state.slice(0, index),
      {
        ...state[index],
        [e.target.name]: e.target.value,
      },
      ...state.slice(index + 1)
    ])
  };

  // Add object with id=1+ the largest id in the state
  const addLine = () => {
    const generatedID = Math.max.apply(Math, [0, ...state.map((o) => o.id)]) + 1
    setState([...state, { id: generatedID, name: "", amount: undefined, unit: "stk" }])
  }

  return (
    <>
      <List dense sx={{
        width: '100%',
        bgcolor: 'background.paper',
        ".sortable-drag": { opacity: "0!important" },
        // ".sortable-ghost": { bgcolor: "grey.200" }
      }}
      >
        {/* ReactSortable handles dragging of items */}
        <ReactSortable animation={140} handle=".handle" list={state} setList={setState}>
          {state.map((item, index) => (
            <ListItem key={item.id} sx={{ bgcolor: 'background.paper', px: 0, transition: "0.3s background-color ease" }}>
              <Stack direction="row" sx={{ alignItems: "center", width: '100%', }} spacing={1}>
                <IconButton size="small" edge="start" className="handle" sx={{ color: "text.secondary", mb: -1.5 }}>
                  <DragIndicator />
                </IconButton>
                <TextField label="Ingredient" variant="standard" size="small" name="name" onChange={(e) => handleChange(index, e)} fullWidth value={item.name} />
                <Stack direction="row">
                  <TextField label="Antall" variant="standard" size="small" type="number" name="amount" onChange={(e) => handleChange(index, e)} fullWidth value={item.amount} />
                  <FormControl fullWidth size="small">
                    <Select
                      id="unit-select"
                      value={item.unit}
                      label="Enhet"
                      name="unit"
                      onChange={(e) => handleChange(index, e)}
                      variant="standard"
                      sx={{ pt: 2 }}
                    >
                      {UNIT_CHOICES.map(unit => (
                        <MenuItem key={unit.value} value={unit.value}>{unit.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
                <div>
                  <IconButton size="small" onClick={() => deleteLine(item.id)} sx={{ color: "text.secondary", mb: -1.5 }}>
                    <DeleteOutlineSharp fontSize="small" />
                  </IconButton>
                </div>
              </Stack>
            </ListItem>
          ))}
        </ReactSortable>
        <Button fullWidth variant="outlined" color="inherit" sx={{ mt: 3, }} onClick={addLine}>Legg til ingrediens</Button>
      </List>
    </>
  )
}

export default IngredientList;