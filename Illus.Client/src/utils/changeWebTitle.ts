export default function changeWebTitle(title: string) {
  const reg = /(\s|\S)+(?=IllusWeb)/;
  const oldTit = document.title;
  
  document.title = reg.test(oldTit)
    ? document.title.replace(reg, title)
    : title + oldTit;
}
