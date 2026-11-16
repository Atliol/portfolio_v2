document.addEventListener('DOMContentLoaded',()=>{
  const filterButtons=document.querySelectorAll('.filter-btn');
  const projects=document.querySelectorAll('.project-item');
  filterButtons.forEach(button=>button.addEventListener('click',()=>{
    filterButtons.forEach(item=>item.classList.remove('active'));
    button.classList.add('active');
    const filter=button.dataset.filter;
    projects.forEach(project=>{
      const categories=project.dataset.category.split(' ');
      project.classList.toggle('hidden',filter!=='all'&&!categories.includes(filter));
    });
  }));
  const moreButton=document.getElementById('moreButton');
  const moreMenu=document.getElementById('moreMenu');
  moreButton.addEventListener('click',()=>moreMenu.classList.toggle('show'));
  moreMenu.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>moreMenu.classList.remove('show')));
  document.addEventListener('click',event=>{if(!moreButton.contains(event.target)&&!moreMenu.contains(event.target))moreMenu.classList.remove('show')});
  document.getElementById('year').textContent=new Date().getFullYear();
});
