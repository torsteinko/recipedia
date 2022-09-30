import { DeleteOutlineSharp, DragIndicator } from "@mui/icons-material";
import { Button, IconButton, List, ListItem, Stack, TextField, Typography } from "@mui/material";
import { ReactSortable } from "react-sortablejs";

interface ItemType {
  id: number;
  description: string;
}

interface Props {
  state: ItemType[];
  setState: (state: ItemType[]) => void;
}

// Props: external component state is updated with setState
const InstructionList = ({ state, setState }: Props) => {

  // Update set to everything excluding the selected id
  const deleteLine = (id: number) => {
    setState(state.filter(item => item.id != id))
  }

  // Spread operator shit: Update object on index input
  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setState([
      ...state.slice(0, index),
      {
        ...state[index],
        description: e.target.value,
      },
      ...state.slice(index + 1)
    ])
  };

  // Add object with id=1+ the largest id in the state
  const addLine = () => {
    const generatedID = Math.max.apply(Math, [0, ...state.map((o) => o.id)]) + 1
    setState([...state, { id: generatedID, description: "" }])
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
                <Stack sx={{ alignItems: "center" }}>
                  <Typography variant="h4" >{index + 1}</Typography>
                  <IconButton className="handle" sx={{ color: "text.secondary" }}>
                    <DragIndicator />
                  </IconButton>
                </Stack>
                <TextField label="Beskrivelse" onChange={(e) => handleChange(index, e)} multiline fullWidth value={item.description} />
                <IconButton size="small" onClick={() => deleteLine(item.id)} sx={{ color: "text.secondary" }}>
                  <DeleteOutlineSharp fontSize="small" />
                </IconButton>
              </Stack>
            </ListItem>
          ))}
        </ReactSortable>
        <Button fullWidth variant="outlined" color="inherit" sx={{ mt: 2 }} onClick={addLine}>Legg til instruksjon</Button>
      </List>
    </>
  )
}

export default InstructionList;