import { UseNavigateStateParams } from "@/core/hooks/useNavigateServerParams";
import { debounce } from "@/core/utils/functions";
import { useAppDispatch } from "@/redux/hooks";
import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { useCallback, useImperativeHandle, useState } from "react";
import { useLocation } from "react-router";
import "./styles.scss";

type Props = {
  search?: "owner" | "projectName";
  searchTerm?: string | undefined;
  setTextRef?: any;
  serverSearching?: boolean;
  onTextChange?: (value: string) => void;
};

const SearchComponent = ({
  search,
  setTextRef,
  serverSearching,
  onTextChange,
  searchTerm,
}: Props) => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  const [searchText, setText] = useState(location.state?.searchText);

  const { handleNavigateStateParams } = UseNavigateStateParams();

  useImperativeHandle(
    setTextRef,
    () => {
      return {
        setText,
      };
    },
    [searchText],
  );

  const handleDelayedSearch = useCallback(
    debounce(async (value) => {
      onTextChange?.(value);
      if (serverSearching) {
        handleNavigateStateParams({
          ...location?.state,
          currentPage: 1,
          [search]: value,
        });
      } else {
        // dispatch(
        //   listingInputSearchActions.getListingInputSearchSlice({
        //     key: search,
        //     value,
        //   }),
        // );
      }
    }, 400),
    [location?.state, search],
  );

  return (
    <div className="w-full search-component-container">
      <Input
        placeholder={searchTerm}
        allowClear
        className=" search-container"
        suffix={<SearchOutlined className=" text-primary" />}
        value={searchText}
        onChange={(e) => {
          setText(e.target.value);
          handleDelayedSearch(e.target.value);
        }}
      />
    </div>
  );
};

export default SearchComponent;
