const LoadingSpinner = (props: any) => {
  return (
    <div className={`border-t-transparent w-6 h-6 border-4 border-solid rounded-full animate-spin ${props.className ? props.className : ""}`}></div>
  )
}

export default LoadingSpinner;