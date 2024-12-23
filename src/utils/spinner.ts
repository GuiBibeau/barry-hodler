export function createSpinner() {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let i = 0;
  let timer: any;
  
  return {
    start: () => {
      timer = setInterval(() => {
        process.stdout.write(`\r${frames[i]} Thinking...`);
        i = (i + 1) % frames.length;
      }, 80);
    },
    stop: () => {
      clearInterval(timer);
      process.stdout.write('\r'); // Clear the spinner line
    }
  };
}
