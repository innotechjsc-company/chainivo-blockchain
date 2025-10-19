import React, { useState } from 'react'
import { TextInput, TextInputProps } from './TextInput'
import { Search } from 'lucide-react'
import { Button } from '../buttons/Button'

export interface SearchInputProps extends Omit<TextInputProps, 'leftIcon' | 'type'> {
  onSearch?: (value: string) => void
  showSearchButton?: boolean
  clearable?: boolean
  searchButtonText?: string
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      onSearch,
      showSearchButton = false,
      clearable = true,
      searchButtonText = 'Search',
      value,
      onChange,
      containerClassName,
      ...props
    },
    ref
  ) => {
    const [searchValue, setSearchValue] = useState('')
    const currentValue = value !== undefined ? value : searchValue

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value)
      onChange?.(e)
      if (!showSearchButton) {
        onSearch?.(e.target.value)
      }
    }

    const handleSearch = () => {
      onSearch?.(String(currentValue || ''))
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleSearch()
      }
    }

    if (showSearchButton) {
      return (
        <div className={containerClassName}>
          <div className="flex gap-2">
            <TextInput
              ref={ref}
              type="search"
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              leftIcon={<Search className="h-4 w-4" />}
              showClearButton={clearable}
              className="flex-1"
              {...props}
            />
            <Button onClick={handleSearch} type="button">
              {searchButtonText}
            </Button>
          </div>
        </div>
      )
    }

    return (
      <TextInput
        ref={ref}
        type="search"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        leftIcon={<Search className="h-4 w-4" />}
        showClearButton={clearable}
        containerClassName={containerClassName}
        {...props}
      />
    )
  }
)

SearchInput.displayName = 'SearchInput'

