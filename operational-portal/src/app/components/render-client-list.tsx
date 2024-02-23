'use client';
import { ClientSearchDetails } from '@app/models/interfaces/clients.interface';
import { Box, ListItem, ListItemButton, ListItemText } from '@mui/material';

interface RenderClientListProps {
  data: ClientSearchDetails[];
  callBackFunction: (data: ClientSearchDetails) => void;
  listContain: {
    first: string;
    second: string;
  };
}

export function RenderClientList(props: RenderClientListProps) {
  const { data, callBackFunction, listContain } = props;
  function renderClientList(props: any) {
    const { index, data } = props;
    return (
      <ListItem key={index} component="div" disablePadding>
        <ListItemButton onClick={() => callBackFunction(data)}>
          <ListItemText primary={data[listContain.first]} style={{ display: 'flex', justifyContent: 'flex-start' }} />
          <ListItemText primary={data[listContain.second]} style={{ display: 'flex', justifyContent: 'flex-end' }} />
        </ListItemButton>
      </ListItem>
    );
  }
  return (
    <Box>
      {data && data.length != 0 ? (
        data.map((search, index) => renderClientList({ index: index, data: search }))
      ) : (
        <ListItem component="div" disablePadding>
          <ListItemButton>
            <ListItemText primary={'No Record Found'} />
          </ListItemButton>
        </ListItem>
      )}
    </Box>
  );
}
