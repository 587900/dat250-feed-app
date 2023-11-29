import React, { useState, useEffect, FC } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from 'react-router-dom';
import { getFrontPagePolls } from "../../services/pollService";
import APIPoll from "../../../../common/model/api-poll";

const Searchbar: FC = () => {
  const [polls, setPolls] = useState<APIPoll[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPolls = async () => {
      const fetchedPolls = await getFrontPagePolls();
      setPolls(fetchedPolls);
    };

    fetchPolls();
  }, []);

  const filteredOptions = polls.filter(poll => 
    poll.title.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleSelect = (event: React.SyntheticEvent, value: string | APIPoll) => {
    if (typeof value === 'object' && value && 'code' in value) {
      navigate(`/poll/vote/${value.code}`);
    }
  };  

  return (
    <Autocomplete
      freeSolo
      disableClearable
      options={filteredOptions}
      getOptionLabel={(option) => typeof option === 'string' ? option : option.title || ''}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      onChange={handleSelect}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search Polls"
          variant="outlined"
          placeholder="Type to search..."
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

export default Searchbar;
