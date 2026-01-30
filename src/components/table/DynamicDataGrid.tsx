import { ChangeEvent, ReactElement, useEffect, useMemo, useState, useCallback } from 'react';
import {
  Divider,
  InputAdornment,
  LinearProgress,
  Link,
  Stack,
  TextField,
  Typography,
  debounce,
  Fade,
  Grow,
  Slide,
  Zoom,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Chip,
} from '@mui/material';
import { DataGrid, GridApi, GridColDef, GridSlots, useGridApiRef } from '@mui/x-data-grid';
import IconifyIcon from 'components/base/IconifyIcon';
import CustomPagination from 'components/sections/dashboard/Home/Sales/TopSellingProduct/CustomPagination';
//
interface ColumnDefinition {
  apiName: string;
  label: string;
  fieldType: string;
}

interface DynamicDataGridProps {
  title: string;
  data: any[][];
  columns: ColumnDefinition[];
  onDataLoad: () => void;
  currencyFields?: string[];
  statusFields?: string[];
  badgeFields?: string[];
  pageSize?: number;
  searchPlaceholder?: string;
  emptyMessage?: string;
  theme?: 'blue' | 'white' | 'custom';
  showActionColumn?: boolean;
}

const DynamicDataGrid = ({
  title,
  data,
  columns,
  onDataLoad,
  currencyFields = ['Billing_Amount__c'],
  statusFields = ['status'],
  badgeFields = ['ImageURL', 'badgeInfoURL'],
  pageSize = 5,
  searchPlaceholder = 'Search...',
  emptyMessage = 'No data available',
  theme = 'blue',
  showActionColumn = true,
}: DynamicDataGridProps): ReactElement => {
  const apiRef = useGridApiRef<GridApi>();
  const [search, setSearch] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Helper functions (same as your Payments component)
  const shouldFormatAsCurrency = (apiName: string, fieldType: string) => {
    return currencyFields.some((field) => apiName.toLowerCase().includes(field.toLowerCase()));
  };

  const getStatusBackgroundColor = (status: string) => {
    const statusColors: { [key: string]: string } = {
      Paid: '#37d45b',
      Pending: '#fff3cd',
      Failed: '#f8d7da',
      Cancelled: '#f5f5f5',
      Processing: '#d1ecf1',
      Refunded: '#e2e3e5',
      Overdue: '#f8d7da',
    };
    return statusColors[status] || '#f8f9fa';
  };

  const getStatusTextColor = (status: string) => {
    const statusTextColors: { [key: string]: string } = {
      Paid: '#155724',
      Pending: '#856404',
      Failed: '#721c24',
      Cancelled: '#6c757d',
      Processing: '#0c5460',
      Refunded: '#495057',
      Overdue: '#721c24',
    };
    return statusTextColors[status] || '#6c757d';
  };

  // Helper function to check if value is empty/null/undefined
  const isEmptyValue = (value: any) => {
    return value === null || value === undefined || value === '' || 
           (typeof value === 'string' && value.trim() === '') ||
           (Array.isArray(value) && value.length === 0);
  };

  // Helper function to render empty value message
  const renderEmptyValue = (fieldType: string) => {
    const message = fieldType === 'Date' ? 'N/A' : 'Not Found';
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        fontStyle="italic"
        sx={{
          transition: 'all 0.3s ease',
          '&:hover': {
            color: 'text.primary',
          },
        }}
      >
        {message}
      </Typography>
    );
  };

  // Helper function to truncate text with ellipsis
  const truncateText = (text: string, maxLength: number = 50) => {
    if (typeof text !== 'string') return text;
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  // Helper function to create ellipsis Typography component
  const createEllipsisTypography = (value: any, maxLength?: number) => {
    const displayValue = typeof value === 'string' ? truncateText(value, maxLength) : value;
    return (
      <Typography
        variant="body2"
        color="black"
        fontWeight="medium"
        sx={{
          transition: 'all 0.3s ease',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: '100%',
          '&:hover': { 
            color: 'primary.main',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            zIndex: 1000,
            position: 'relative',
            backgroundColor: 'white',
            padding: '4px',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          },
        }}
        title={typeof value === 'string' ? value : undefined}
      >
        {displayValue}
      </Typography>
    );
  };

  // Enhanced dynamic renderer with badge support
  const getDynamicRenderer = (column: ColumnDefinition) => {
    return (params: any) => {
      const value = params.value;
      const { fieldType, apiName } = column;

      // Check for empty values first
      if (isEmptyValue(value)) {
        return renderEmptyValue(fieldType);
      }

      // Badge-specific rendering
      if (badgeFields.includes(apiName)) {
        if (apiName === 'ImageURL' && value) {
          return (
            <Stack direction="row" spacing={1} alignItems="center">
              <img 
                src={value} 
                alt="Badge" 
                style={{ 
                  width: 40, 
                  height: 40, 
                  objectFit: 'contain',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0'
                }} 
              />
              <Typography
                variant="body2"
                color="black"
                fontWeight="medium"
                sx={{
                  transition: 'all 0.3s ease',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '100px',
                  '&:hover': {
                    color: 'primary.main',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    zIndex: 1000,
                    position: 'relative',
                    backgroundColor: 'white',
                    padding: '4px',
                    borderRadius: '4px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  },
                }}
                title="View Badge"
              >
                View Badge
              </Typography>
            </Stack>
          );
        }

        if (apiName === 'badgeInfoURL' && value) {
          return (
            <Typography variant="body2" color="black" fontWeight="medium">
              <Link
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  textDecoration: 'none',
                  color: 'black',
                  fontWeight: 'medium',
                  transition: 'all 0.3s ease',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '120px',
                  '&:hover': {
                    textDecoration: 'underline',
                    transform: 'translateY(-2px)',
                    color: 'primary.main',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    zIndex: 1000,
                    position: 'relative',
                    backgroundColor: 'white',
                    padding: '4px',
                    borderRadius: '4px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  },
                }}
                title={value}
              >
                <IconifyIcon
                  icon="mdi:information-outline"
                  width={18}
                  height={18}
                  color="#2196f3"
                  style={{ transition: 'all 0.3s ease' }}
                />
                More Info
              </Link>
            </Typography>
          );
        }
      }

      // Boolean field rendering (for IsAcceptedBadge)
      if (apiName === 'IsAcceptedBadge') {
        return (
          <Typography
            variant="body2"
            sx={{
              backgroundColor: value ? '#37d45b' : '#f8d7da',
              color: value ? '#155724' : '#721c24',
              padding: '4px 8px',
              borderRadius: '4px',
              fontWeight: 'medium',
              textAlign: 'center',
              minWidth: '80px',
              display: 'inline-block',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '120px',
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                zIndex: 1000,
                position: 'relative',
              },
            }}
            title={value ? 'Accepted' : 'Not Accepted'}
          >
            {value ? 'Accepted' : 'Not Accepted'}
          </Typography>
        );
      }

      // Existing currency formatting logic
      if (shouldFormatAsCurrency(apiName, fieldType)) {
        const numericValue = typeof value === 'string' ? parseFloat(value) : value;
        if (!isNaN(numericValue)) {
          const formattedCurrency = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(numericValue);
          return createEllipsisTypography(formattedCurrency, 20);
        }
        // If currency value is invalid, show Not Found
        return renderEmptyValue(fieldType);
      }

      // Existing status field handling
      if (statusFields.some(field => apiName.toLowerCase().includes(field.toLowerCase()))) {
        return (
          <Typography
            variant="body2"
            sx={{
              backgroundColor: getStatusBackgroundColor(value),
              color: getStatusTextColor(value),
              padding: '4px 8px',
              borderRadius: '4px',
              fontWeight: 'medium',
              textAlign: 'center',
              minWidth: '80px',
              display: 'inline-block',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '120px',
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                zIndex: 1000,
                position: 'relative',
              },
            }}
            title={value}
          >
            {value}
          </Typography>
        );
      }

      // Existing field type handling
      switch (fieldType) {
        case 'Date':
          const date = new Date(value);
          if (isNaN(date.getTime())) {
            return renderEmptyValue(fieldType);
          }
          return createEllipsisTypography(date.toLocaleDateString(), 15);

        case 'String':
          if (typeof value === 'string' && value.startsWith('http')) {
            return (
              <Typography variant="body2" color="black" fontWeight="medium">
                <Link
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    textDecoration: 'none',
                    color: 'black',
                    fontWeight: 'medium',
                    transition: 'all 0.3s ease',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '150px',
                    '&:hover': {
                      textDecoration: 'underline',
                      transform: 'translateY(-2px)',
                      color: 'primary.main',
                      whiteSpace: 'normal',
                      wordBreak: 'break-word',
                      zIndex: 1000,
                      position: 'relative',
                      backgroundColor: 'white',
                      padding: '4px',
                      borderRadius: '4px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    },
                  }}
                  title={value}
                >
                  <IconifyIcon
                    icon="mdi:file-pdf-box"
                    width={18}
                    height={18}
                    color="#dc3545"
                    style={{ transition: 'all 0.3s ease' }}
                  />
                  View Document
                </Link>
              </Typography>
            );
          }
          return createEllipsisTypography(value, 50);

        case 'Number':
          const numericValue = typeof value === 'string' ? parseFloat(value) : value;
          if (isNaN(numericValue)) {
            return renderEmptyValue(fieldType);
          }
          const formattedNumber = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(numericValue);
          return createEllipsisTypography(formattedNumber, 20);

        default:
          return createEllipsisTypography(value, 50);
      }
    };
  };

  // Handle view record - use useCallback to prevent re-renders
  const handleViewRecord = useCallback((record: any) => {
    setSelectedRecord(record);
    setIsViewModalOpen(true);
  }, []);

  // Handle close modal - use useCallback to prevent re-renders
  const handleCloseModal = useCallback(() => {
    setIsViewModalOpen(false);
    setSelectedRecord(null);
  }, []);

  // Action column renderer - use useCallback to prevent re-renders
  const renderActionColumn = useCallback((params: any) => {
    return (
      <IconButton
        onClick={() => handleViewRecord(params.row)}
        sx={{
          color: 'primary.main',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.2)',
            color: 'primary.dark',
            backgroundColor: 'primary.light',
          },
        }}
        title="View Details"
      >
        <IconifyIcon
          icon="mdi:eye"
          width={20}
          height={20}
        />
      </IconButton>
    );
  }, [handleViewRecord]);

  // Dynamic columns with ellipsis support - use useMemo to prevent re-renders
  const dynamicColumns: GridColDef[] = useMemo(() => {
    if (!columns) return [];

    const baseColumns = columns.map((column) => ({
      field: column.apiName,
      headerName: column.label,
      flex: 1,
      minWidth: 150,
      filterable: column.fieldType !== 'Date',
      sortable: true,
      renderCell: getDynamicRenderer(column),
      renderHeader: () => (
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 'bold',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '100%',
            '&:hover': {
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              zIndex: 1000,
              position: 'relative',
              backgroundColor: 'white',
              padding: '4px',
              borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            },
          }}
          title={column.label}
        >
          {column.label}
        </Typography>
      ),
    }));

    // Add action column if enabled
    if (showActionColumn) {
      baseColumns.push({
        field: 'actions',
        headerName: 'Actions',
        flex: 0,
        minWidth: 100,
        sortable: false,
        filterable: false,
        renderCell: renderActionColumn,
        renderHeader: () => (
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            Actions
          </Typography>
        ),
      });
    }

    return baseColumns;
  }, [columns, showActionColumn, renderActionColumn]);

  // Transform rows
  const dynamicRows = useMemo(() => {
    if (!data) return [];

    return data.map((row: any[], rowIndex: number) => {
      const transformedRow: any = { id: `${rowIndex + 1}` };

      row.forEach((field: any) => {
        let columnFieldName = field.fieldName;
        
        // Handle field name mappings
        if (field.fieldName === 'Collection_Date__c') {
          columnFieldName = 'Billing_Date__c';
        }
        
        transformedRow[columnFieldName] = field.value;
      });

      return transformedRow;
    });
  }, [data]);

  const handleGridSearch = useMemo(() => {
    return debounce((searchValue) => {
      apiRef.current.setQuickFilterValues(
        searchValue.split(' ').filter((word: any) => word !== ''),
      );
    }, 250);
  }, [apiRef]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.currentTarget.value;
    setSearch(searchValue);
    handleGridSearch(searchValue);
  };

  useEffect(() => {
    onDataLoad();
  }, [onDataLoad]);

  useEffect(() => {
    if (data && data.length > 0) {
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [data]);

  const getThemeStyles = () => {
    switch (theme) {
      case 'blue':
        return { bgcolor: 'background.blue' };
      case 'white':
        return { bgcolor: 'common.white' };
      default:
        return { bgcolor: 'background.blue' };
    }
  };

  // Record detail modal - use useMemo to prevent re-renders
  const RecordDetailModal = useMemo(() => {
    return (
      <Dialog
        open={isViewModalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        TransitionComponent={Fade}
        transitionDuration={300}
      >
        <DialogTitle
          sx={{
            backgroundColor: theme === 'blue' ? 'primary.main' : 'background.paper',
            color: theme === 'blue' ? 'white' : 'text.primary',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6">Record Details</Typography>
          <IconButton
            onClick={handleCloseModal}
            sx={{ color: theme === 'blue' ? 'white' : 'text.primary' }}
          >
            <IconifyIcon icon="mdi:close" width={24} height={24} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 ,mt: 4}}>
          {selectedRecord && (
            <Stack spacing={2}>
              {columns.map((column) => {
                const value = selectedRecord[column.apiName];
                return (
                  <Box key={column.apiName}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ fontWeight: 'bold', mb: 1 }}
                    >
                      {column.label}
                    </Typography>
                    <Box>
                      {isEmptyValue(value) ? (
                        <Typography variant="body2" color="text.secondary" fontStyle="italic">
                          {column.fieldType === 'Date' ? 'N/A' : 'Not Found'}
                        </Typography>
                      ) : (
                        <Box>
                          {badgeFields.includes(column.apiName) && column.apiName === 'ImageURL' && value && (
                            <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                              <img
                                src={value}
                                alt="Badge"
                                style={{
                                  width: 60,
                                  height: 60,
                                  objectFit: 'contain',
                                  borderRadius: '8px',
                                  border: '1px solid #e0e0e0',
                                }}
                              />
                            </Stack>
                          )}
                          {badgeFields.includes(column.apiName) && column.apiName === 'badgeInfoURL' && value && (
                            <Link
                              href={value}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 1,
                                textDecoration: 'none',
                                color: 'primary.main',
                                '&:hover': {
                                  textDecoration: 'underline',
                                },
                              }}
                            >
                              <IconifyIcon
                                icon="mdi:information-outline"
                                width={18}
                                height={18}
                              />
                              View Badge Information
                            </Link>
                          )}
                          {column.apiName === 'IsAcceptedBadge' && (
                            <Chip
                              label={value ? 'Accepted' : 'Not Accepted'}
                              sx={{
                                backgroundColor: value ? '#37d45b' : '#f8d7da',
                                color: value ? '#155724' : '#721c24',
                                fontWeight: 'medium',
                              }}
                            />
                          )}
                          {shouldFormatAsCurrency(column.apiName, column.fieldType) && (
                            <Typography variant="body1" fontWeight="medium">
                              {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                              }).format(typeof value === 'string' ? parseFloat(value) : value)}
                            </Typography>
                          )}
                          {statusFields.some(field => column.apiName.toLowerCase().includes(field.toLowerCase())) && (
                            <Chip
                              label={value}
                              sx={{
                                backgroundColor: getStatusBackgroundColor(value),
                                color: getStatusTextColor(value),
                                fontWeight: 'medium',
                              }}
                            />
                          )}
                          {column.fieldType === 'Date' && (
                            <Typography variant="body1" fontWeight="medium">
                              {new Date(value).toLocaleDateString()}
                            </Typography>
                          )}
                          {column.fieldType === 'String' && typeof value === 'string' && value.startsWith('http') && (
                            <Link
                              href={value}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 1,
                                textDecoration: 'none',
                                color: 'primary.main',
                                '&:hover': {
                                  textDecoration: 'underline',
                                },
                              }}
                            >
                              <IconifyIcon
                                icon="mdi:file-pdf-box"
                                width={18}
                                height={18}
                              />
                              View Document
                            </Link>
                          )}
                          {!badgeFields.includes(column.apiName) &&
                            column.apiName !== 'IsAcceptedBadge' &&
                            !shouldFormatAsCurrency(column.apiName, column.fieldType) &&
                            !statusFields.some(field => column.apiName.toLowerCase().includes(field.toLowerCase())) &&
                            column.fieldType !== 'Date' &&
                            !(column.fieldType === 'String' && typeof value === 'string' && value.startsWith('http')) && (
                            <Typography variant="body1" fontWeight="medium">
                              {value}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCloseModal}
            variant="outlined"
            sx={{
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }, [isViewModalOpen, selectedRecord, columns, theme, badgeFields, statusFields, handleCloseModal]);

  return (
    <>
      <Fade in={true} timeout={500}>
        <Stack
          {...getThemeStyles()}
          width={1}
          boxShadow={(theme) => theme.shadows[4]}
          height={1}
          mt={3.75}
          mb={2.75}
        >
          <Slide direction="down" in={true} timeout={600}>
            <Stack
              direction={{ sm: 'row' }}
              justifyContent="space-between"
              alignItems="center"
              padding={3.75}
              gap={3.75}
            >
              <Grow in={true} timeout={800}>
                <Typography
                  variant="h5"
                  color={theme === 'blue' ? 'white' : 'text.primary'}
                  sx={{
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      textShadow: theme === 'blue' ? '0 0 10px rgba(255,255,255,0.5)' : 'none',
                    },
                  }}
                >
                  {title}
                </Typography>
              </Grow>
              <Zoom in={true} timeout={1000}>
                <TextField
                  sx={{
                    '& .MuiFilledInput-root': {
                      backgroundColor: 'white',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: '#f8f9fa',
                        transform: 'scale(1.02)',
                      },
                      '&:focus-within': {
                        backgroundColor: '#ffffff',
                        transform: 'scale(1.05)',
                        boxShadow: '0 0 15px rgba(0,0,0,0.1)',
                      },
                    },
                  }}
                  variant="filled"
                  placeholder={searchPlaceholder}
                  onChange={handleChange}
                  value={search}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end" sx={{ width: 24, height: 24 }}>
                        <IconifyIcon
                          icon="mdi:search"
                          width={1}
                          height={1}
                          style={{ transition: 'all 0.3s ease' }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              </Zoom>
            </Stack>
          </Slide>
          <Divider />
          <Grow in={isLoaded} timeout={1200}>
            <Stack height={1}>
              <DataGrid
                apiRef={apiRef}
                columns={dynamicColumns}
                rows={dynamicRows}
                getRowHeight={() => 70}
                hideFooterSelectedRowCount
                disableColumnResize
                disableColumnSelector
                disableRowSelectionOnClick
                rowSelection={false}
                initialState={{
                  pagination: { paginationModel: { pageSize, page: 0 } },
                }}
                pageSizeOptions={[pageSize]}
                onResize={() => {
                  apiRef.current.autosizeColumns({
                    includeOutliers: true,
                    expand: true,
                  });
                }}
                slots={{
                  loadingOverlay: LinearProgress as GridSlots['loadingOverlay'],
                  pagination: CustomPagination,
                  noRowsOverlay: () => (
                    <Fade in={true} timeout={500}>
                      <section
                        style={{
                          padding: '20px',
                          textAlign: 'center',
                          color: '#6c757d',
                          fontSize: '16px',
                        }}
                      >
                        {emptyMessage}
                      </section>
                    </Fade>
                  ),
                }}
                sx={{
                  height: 1,
                  width: 1,
                  bgcolor: 'common.white',
                  '& .MuiDataGrid-root': {
                    transition: 'all 0.3s ease',
                  },
                }}
              />
            </Stack>
          </Grow>
        </Stack>
      </Fade>
      {RecordDetailModal}
    </>
  );
};

export default DynamicDataGrid;