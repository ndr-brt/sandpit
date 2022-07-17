#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod tidal;

use std::sync::Mutex;
use tauri::Window;
use crate::tidal::Tidal;

struct MyState(Mutex<Tidal>);

#[tauri::command]
fn tidal_eval(state: tauri::State<MyState>, window: Window, code: String, app_handle: tauri::AppHandle) {
  let mut tidal = state.0.lock().unwrap();
  
  if !tidal.is_running() {
    let mut resource_dir = app_handle.path_resolver().resource_dir().expect("Error getting resource directory path");
    resource_dir.push("resources");
    resource_dir.push("BootTidal.hs");
    let path = resource_dir.to_str().expect("Error getting BootTidal.hs path").to_string();
    println!("{}", path);
    tidal.start(window, path);
  }
  tidal.send_line(code.to_string());
}

fn main() {
  let tidal = Mutex::new(Tidal::new());

  let context = tauri::generate_context!();
  let app = tauri::Builder::default()
    .manage(MyState(tidal))
    .invoke_handler(tauri::generate_handler![tidal_eval])
    .menu(tauri::Menu::os_default(&context.package_info().name))
    .build(context)
    .expect("error while running tauri application");
  
  app.run(|_app_handle, event| match event {
    tauri::RunEvent::ExitRequested { api, .. } => {
      api.prevent_exit();
    }
    _ => {}
  });
}
