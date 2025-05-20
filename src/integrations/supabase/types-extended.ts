
// Extended types for Supabase RPC functions

// Define a type for the parameters of the increment_views function
export interface IncrementViewsParams {
  table_name: string;
  row_id: string;
}

// Export a generic type for RPC functions to help TypeScript understand the structure
export type RPCFunction<T> = (params: T) => Promise<any>;

// Define the type for Postgrest RPC calls
export type PostgrestRPC = {
  rpc<T>(
    fn: string,
    params: T
  ): any;
};
