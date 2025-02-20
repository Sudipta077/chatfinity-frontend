export default function LoadingModal() {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-5 rounded-lg shadow-lg flex items-center justify-center">
          
          <div className="animate-spin h-10 w-10 border-t-4 border-blue-500 border-solid rounded-full"></div>
        </div>
      </div>
    );
  }
  