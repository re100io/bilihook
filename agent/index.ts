import { xInfo } from "harvester";

xInfo("Hello Frida Hook");


console.log("hello bili hook");

function main() {
    var do_dlopen = null;
    var call_constructor = null;
    Process.findModuleByName("linker64").enumerateSymbols().forEach(function (symbol) {
        if (symbol.name.indexOf("do_dlopen") >= 0) {
            do_dlopen = symbol.address;
        }
        if (symbol.name.indexOf("call_constructor") >= 0) {
            call_constructor = symbol.address;
        }
    });

    var lib_loaded = 0;
    Interceptor.attach(do_dlopen, function () {
        var library_path = this.context['x0'].readCString();
        console.log(library_path);
        if (library_path != null && library_path.indexOf("libmsaoaidsec.so") >= 0) {
            Interceptor.attach(call_constructor, function () {
                if (lib_loaded == 0) {
                    lib_loaded = 1;
                    var module = Process.findModuleByName("libmsaoaidsec.so");
                    console.log(`[+] libmsaoaidsec.so is loaded at ${module.base}`);
                    hook_bili(module.base);
                }
            })
        }
    });
}

function hook_bili(base) {
    // init_proc 0x1360C
    Interceptor.attach(base.add(0x1360C), {
        onEnter: function (args) {

        }
    });

    // 139AC /proc/14810/cmdline
    Interceptor.attach(base.add(0x139AC), {
        onEnter: function (args) {
            console.log('[Info] fopen:' + this.context['x0'].readCString())
        }
    });

    // sub_c534
    Interceptor.attach(base.add(0xc534), {
        onEnter: function (args) {
            console.log('[Info] bili: ' + args[1].readCString())
        },
    });
    
}

setImmediate(main, 100);

export { };