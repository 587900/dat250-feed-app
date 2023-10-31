import React, { useState, useEffect, FC } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import ClearIcon from "@mui/icons-material/Clear";

// Assuming OptionType is the type of options you are dealing with, replace it with your actual type
interface OptionType {
  name: string;
  categoryId?: number; // Assuming categoryId is a number, adjust as per your data structure
}

// Assuming categories is a constant, replace it with your actual data
const categories = [
  { id: 1, name: "Category 1" },
  { id: 2, name: "Category 2" },
  // ... other categories
];

// Assuming sortedOptions is a constant, replace it with your actual data
const sortedOptions: OptionType[] = [
  { name: "Option 1", categoryId: 1 },
  { name: "Option 2", categoryId: 2 },
  // ... other options
];

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
    if (typeof value !== "string") {
      console.log(value);
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
      groupBy={(option) => {
        const parentCategory = categories.find(
          (cat) => cat.id === option.categoryId
        );
        return parentCategory ? parentCategory.name : "Unknown";
      }}
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
