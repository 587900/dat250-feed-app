import React, { useState, FC } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";

const AdminSearchbar: FC<{ onSearch: (term: string) => void }> = ({ onSearch }) => {
  const [inputValue, setInputValue] = useState<string>("");

  const handleInputChange = (event: React.SyntheticEvent, newInputValue: string) => {
    setInputValue(newInputValue);
    onSearch(newInputValue); // Pass the search term to the parent component
  };

  return (
    <Autocomplete
      freeSolo
      disableClearable
      inputValue={inputValue}
      onInputChange={handleInputChange}
      options={[]} // No need for options in this case
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search Polls"
          variant="outlined"
          placeholder="Search by title or poll code"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {inputValue && <SearchIcon sx={{ cursor: "pointer", color: 'primary.light' }} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default AdminSearchbar;
