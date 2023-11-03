import React, { useState, useEffect, FC } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import "@mui/material/styles";

// Assuming OptionType is the type of options you are dealing with, replace it with your actual type
interface OptionType {
  name: string;
  categoryId?: number; // Assuming categoryId is a number, adjust as per your data structure
}

const mockData = [
  { name: "Apple", categoryId: 1 },
  { name: "Banana", categoryId: 1 },
  { name: "Cherry", categoryId: 1 },
  { name: "Date", categoryId: 2 },
  { name: "Elderberry", categoryId: 2 },
  { name: "Fig", categoryId: 2 },
  { name: "Grape", categoryId: 3 },
  { name: "Honeydew", categoryId: 3 },
  { name: "Indian Fig", categoryId: 3 },
];

// Assuming sortedOptions is a constant, replace it with your actual data
const sortedOptions: OptionType[] = mockData;

const Searchbar: FC = () => {
  const [recentSearches, setRecentSearches] = useState<OptionType[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Function to handle selection from the autocomplete
  const handleSelect = (
    event: React.SyntheticEvent<Element, Event>,
    value: string | OptionType,
    reason: string,
    details?: any
  ) => {
    if (typeof value !== "string" && !recentSearches.includes(value)) {
      setRecentSearches([...recentSearches, value]);
    }
  };

  // Function to remove a recent search
  const removeRecentSearch = (item: OptionType) => {
    setRecentSearches(recentSearches.filter((search) => search !== item));
  };

  return (
    <Autocomplete
      freeSolo
      disableClearable
      open={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      options={
        inputValue
          ? sortedOptions
          : recentSearches.length
          ? recentSearches
          : sortedOptions
      }
      // The groupBy prop has been removed
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.name
      }
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      onChange={handleSelect}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          {option.name}
          {recentSearches.includes(option) && (
            <ClearIcon
              onClick={() => removeRecentSearch(option)}
              sx={{ cursor: "pointer", marginLeft: "auto" }}
            />
          )}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search"
          variant="outlined"
          placeholder="Type to search..."
          InputLabelProps={{
            style: { top: "-3px" },
          }}
          InputProps={{
            ...params.InputProps,
            style: { padding: "3px 8px" },
            endAdornment: (
              <>
                {inputValue && (
                  <ClearIcon
                    onClick={() => {
                      setInputValue("");
                    }}
                    sx={{ cursor: "pointer" }}
                  />
                )}
                <SearchIcon sx={{ cursor: "pointer", color: 'primary.light' }} />
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default Searchbar;